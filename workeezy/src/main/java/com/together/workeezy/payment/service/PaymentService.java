package com.together.workeezy.payment.service;

import com.together.workeezy.payment.client.TossPaymentClient;
import com.together.workeezy.payment.dto.PaymentConfirmRequest;
import com.together.workeezy.payment.dto.PaymentConfirmResponse;
import com.together.workeezy.payment.repository.PaymentRepository;
import com.together.workeezy.reservation.Reservation;
import com.together.workeezy.reservation.ReservationStatus;
import com.together.workeezy.reservation.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

        if(!reservation.getUser().getEmail().equals(userEmail)) {
            throw new CustomException(FORBIDDEN_ACCESS);
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

        // 승인 성공 → Payment 엔티티 업데이트

        // Reservation 상태 CONFIRMED 변경

        // DB 저장 & 응답 반환

        return null;
    }
}
