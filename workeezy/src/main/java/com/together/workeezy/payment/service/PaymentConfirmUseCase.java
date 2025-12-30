package com.together.workeezy.payment.service;

import com.together.workeezy.common.exception.CustomException;
import com.together.workeezy.payment.dto.PaymentConfirmCommand;
import com.together.workeezy.payment.dto.response.PaymentConfirmResponse;
import com.together.workeezy.payment.dto.response.TossConfirmResponse;
import com.together.workeezy.payment.entity.Payment;
import com.together.workeezy.payment.enums.PaymentMethod;
import com.together.workeezy.payment.repository.PaymentRepository;
import com.together.workeezy.reservation.domain.Reservation;
import com.together.workeezy.reservation.enums.ReservationStatus;
import com.together.workeezy.reservation.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.together.workeezy.common.exception.ErrorCode.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentConfirmUseCase {

    private final ReservationRepository reservationRepository;
    private final PaymentRepository paymentRepository;
    private final PaymentValidator paymentValidator;
    private final PaymentProcessor paymentProcessor;
//    private final PaymentLogService paymentLogService;

    @Transactional
    public PaymentConfirmResponse confirm(PaymentConfirmCommand cmd) {
        log.info("🔥 confirm START orderId={}, amount={}, paymentKey={}, user={}",
                cmd.orderId(), cmd.amount(), cmd.paymentKey(), cmd.userEmail());

        // 기본 파라미터 검증
        paymentValidator.validateBasic(cmd);

        // 예약 조회
        Reservation reservation = reservationRepository.findByReservationNo(cmd.orderId())
                .orElseThrow(() -> new CustomException(RESERVATION_NOT_FOUND));

        log.info("🔥 reservation found id={}, no={}, status={}",
                reservation.getId(), reservation.getReservationNo(), reservation.getStatus());

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

        if (payment == null) {
            log.info("🔥 creating payment");
            payment = Payment.create(reservation, cmd.amount());
            paymentRepository.save(payment);
//            log.info("🔥 payment before save = {}", payment.getId());
//            paymentRepository.save(payment);
//            log.info("🔥 payment after save = {}", payment.getId());
        }

        TossConfirmResponse api = paymentProcessor.confirm(
                cmd.paymentKey(),
                cmd.orderId(),
                cmd.amount()
        );

        log.info("🔥 Toss confirm response orderId={}, amount={}, method={}, approvedAt={}",
                api.getOrderId(), api.getAmount(), api.getMethod(), api.getApprovedAt());

        PaymentMethod method = PaymentMethod.fromToss(api.getMethod());

        payment.approve(
                api.getOrderId(),
                api.getPaymentKey(),
                cmd.amount(),
                method,
                api.getApprovedAt()
        );

        if (api.getAmount() != null && !api.getAmount().equals(cmd.amount())) {
            log.error("🔥 Toss amount mismatch toss={}, request={}", api.getAmount(), cmd.amount());
            throw new CustomException(PAYMENT_AMOUNT_MISMATCH);
        }

        log.info("🔥 payment approved paymentId={}, status={}, approvedAt={}",
                payment.getId(), payment.getStatus(), payment.getApprovedAt());

        reservation.markConfirmed();
        reservationRepository.save(reservation);

        log.info("🔥 reservation confirmed id={}, status={}",
                reservation.getId(), reservation.getStatus());

        return PaymentConfirmResponse.of(payment, reservation);
    }
}