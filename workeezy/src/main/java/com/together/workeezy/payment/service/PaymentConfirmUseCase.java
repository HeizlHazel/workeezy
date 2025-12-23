package com.together.workeezy.payment.service;

import com.together.workeezy.common.exception.CustomException;
import com.together.workeezy.payment.dto.PaymentConfirmCommand;
import com.together.workeezy.payment.dto.response.PaymentConfirmResponse;
import com.together.workeezy.payment.dto.response.TossConfirmResponse;
import com.together.workeezy.payment.entity.Payment;
import com.together.workeezy.payment.repository.PaymentRepository;
import com.together.workeezy.reservation.Reservation;
import com.together.workeezy.reservation.ReservationStatus;
import com.together.workeezy.reservation.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.together.workeezy.common.exception.ErrorCode.*;
import static com.together.workeezy.common.exception.ErrorCode.PAYMENT_ALREADY_COMPLETED;

@Service
@RequiredArgsConstructor
public class PaymentConfirmUseCase {

    private final ReservationRepository reservationRepository;
    private final PaymentRepository paymentRepository;
    private final PaymentValidator paymentValidator;
    private final PaymentProcessor paymentProcessor;

    @Transactional
    public PaymentConfirmResponse confirm(PaymentConfirmCommand cmd) {

        // 기본 파라미터 검증
        paymentValidator.validateBasic(cmd);

        // 예약 조회
        Reservation reservation = reservationRepository.findById(cmd.reservationId())
                .orElseThrow(() -> new CustomException(RESERVATION_NOT_FOUND));

        // 예약 소유자 검증
        paymentValidator.validateReservationOwner(reservation, cmd.userEmail());

        // orderId (= reservation_no) 검증
        paymentValidator.validateOrderId(reservation, cmd.orderId());

        // 금액 검증
        paymentValidator.validateAmount(reservation, cmd.amount());

        // 이미 결제된 예약인지 체크
        if (reservation.getStatus() == ReservationStatus.confirmed) {
            throw new CustomException(PAYMENT_ALREADY_COMPLETED);
        }

        Payment payment = reservation.getPayment();

        if(payment == null)
            payment = Payment.create(reservation, cmd.amount());

        TossConfirmResponse api = paymentProcessor.confirm(
                cmd.paymentKey(),
                cmd.orderId(),
                cmd.amount()
        );

        // Payment 도메인 메서드로 승인 처리
        payment.approve(
                api.getOrderId(),
                api.getPaymentKey(),
                api.getAmount(),
                api.getMethod(),
                api.getApprovedAt()
        );

        // Reservation 상태 CONFIRMED
        reservation.markConfirmed();

        paymentRepository.save(payment);

        // 응답 생성
        return PaymentConfirmResponse.of(payment, reservation);
    }
}