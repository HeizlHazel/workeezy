package com.together.workeezy.payment.service;

import com.together.workeezy.common.exception.CustomException;
import com.together.workeezy.payment.client.TossPaymentClient;
import com.together.workeezy.payment.dto.PaymentConfirmRequest;
import com.together.workeezy.payment.dto.PaymentConfirmResponse;
import com.together.workeezy.payment.dto.TossConfirmResponseDto;
import com.together.workeezy.payment.entity.Payment;
import com.together.workeezy.payment.enums.PaymentStatus;
import com.together.workeezy.payment.repository.PaymentRepository;
import com.together.workeezy.reservation.Reservation;
import com.together.workeezy.reservation.ReservationStatus;
import com.together.workeezy.reservation.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.together.workeezy.common.exception.ErrorCode.*;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final TossPaymentClient tossPaymentClient;
    private final PaymentRepository paymentRepository;
    private final ReservationRepository reservationRepository;

    @Transactional
    public PaymentConfirmResponse confirmPayment(PaymentConfirmRequest request, String userEmail) {
        // 요청 검증 (paymentKey, orderId, amount)
        validateRequest(request);

        // 예약 조회 (reservationId / orderId 기준)
        // 주문id는 예약id+타임스탬프 같은 패턴으로 유니크하게 생성해서 toss/db 동일하게 사용
        Reservation reservation = reservationRepository.findById(request.getReservationId())
                .orElseThrow(() -> new CustomException(RESERVATION_NOT_FOUND));

        // 예약 소유자 검증
        if(!reservation.getUser().getEmail().equals(userEmail)) {
            throw new CustomException(FORBIDDEN_ACCESS);
        }

        // orderId(=reservation_no) 검증
        if(!reservation.getReservationNo().equals(request.getOrderId())) {
            throw new CustomException(ORDER_ID_MISMATCH);
        }

        // 해당 예약의 totalPrice와 비교 동일한지 검증
        // 프론트에서 넘어온 amount는 무조건 예약 엔티티/프로그램 가격으로 다시 확인하고 비교
        if(!reservation.getTotalPrice().equals(request.getAmount())) {
            throw new CustomException(PAYMENT_AMOUNT_MISMATCH);
        }

        // 이미 결제된 예약인지 체크
        if(reservation.getStatus() == ReservationStatus.confirmed) {
            throw new CustomException(PAYMENT_ALREADY_COMPLETED);
        }

        // Toss API로 결제 승인 요청
        // tossPaymentClient.confirm(...) 호출
        TossConfirmResponseDto tossResponse =
                tossPaymentClient.confirm(
                        request.getPaymentKey(),
                        request.getOrderId(),       // reservation_no 보냄
                        request.getAmount()
                );

        // Payment 엔티티 조회 (1:1 관계)
        Payment payment = reservation.getPayment();
        if(payment == null) {
            payment = new Payment();
            payment.setReservation(reservation);
            payment.setStatus(PaymentStatus.ready);
            payment.setPaymentMethod("INIT");
            reservation.setPayment(payment);
        }

        // 승인 성공 → Payment 엔티티 업데이트
        payment.setPaymentKey(tossResponse.getPaymentKey());
        payment.setOrderId(tossResponse.getOrderId());          // reservation_no
        payment.setAmount(tossResponse.getAmount());
        payment.setPaymentMethod(tossResponse.getMethod());
        payment.setApprovedAt(tossResponse.getApprovedAt());
        payment.setStatus(PaymentStatus.paid);

        paymentRepository.save(payment);

        // Reservation 상태 CONFIRMED 변경
        reservation.setStatus(ReservationStatus.confirmed);
        reservationRepository.save(reservation);

        // DB 저장 & 응답 반환
        return PaymentConfirmResponse.of(payment, reservation);
    }

    private void validateRequest(PaymentConfirmRequest request) {
        if(request.getPaymentKey() == null || request.getPaymentKey().isBlank()) {
            throw new CustomException(PAYMENT_KEY_MISSING);
        }
        if(request.getOrderId() == null || request.getOrderId().isBlank()) {
            throw new CustomException(ORDER_ID_MISSING);
        }
        if(request.getAmount() == null || request.getAmount() <= 0) {
            throw new CustomException(AMOUNT_INVALID);
        }
    }

    @Transactional(readOnly = true)
    public PaymentConfirmResponse getPayment(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new CustomException(RESERVATION_NOT_FOUND));

        if(reservation.getPayment() == null)
            throw new CustomException(PAYMENT_NOT_FOUND);

        return PaymentConfirmResponse.of(reservation.getPayment(), reservation);
    }
}
