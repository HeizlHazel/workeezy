package com.together.workeezy.payment.service;

import com.together.workeezy.common.exception.CustomException;
import com.together.workeezy.payment.dto.PaymentConfirmCommand;
import com.together.workeezy.reservation.domain.Reservation;
import com.together.workeezy.reservation.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import static com.together.workeezy.common.exception.ErrorCode.*;

@Slf4j
@Component
@RequiredArgsConstructor
public class PaymentValidator {

    private final ReservationRepository reservationRepository;

    // 결제 가능 여부
    public Reservation validatePayable(Long reservationId, Long userId) {
        log.info("🔥 validatePayable reservationId=" + reservationId);

        Reservation reservation =
                reservationRepository.findByIdAndUserId(reservationId, userId)
                        .orElseThrow(() -> new CustomException(RESERVATION_NOT_FOUND));

        // 관리자 승인 후에만 결제 가능
        if (!reservation.isPayable()) {
            throw new CustomException(PAYMENT_NOT_ALLOWED);
        }

        return reservation;
    }

    public void validateBasic(PaymentConfirmCommand cmd) {
        if (cmd.paymentKey() == null || cmd.paymentKey().isBlank())
            throw new CustomException(PAYMENT_KEY_MISSING);

        if (cmd.orderId() == null || cmd.orderId().isBlank())
            throw new CustomException(ORDER_ID_MISSING);

        if (cmd.amount() == null || cmd.amount() <= 0)
            throw new CustomException(AMOUNT_INVALID);
    }

    public void validateReservationOwner(Reservation reservation, String email) {
        if (!reservation.getUser().getEmail().equals(email))
            throw new CustomException(FORBIDDEN_ACCESS);
    }

    public void validateOrderId(Reservation reservation, String orderId) {
        if (!reservation.getReservationNo().equals(orderId))
            throw new CustomException(ORDER_ID_MISMATCH);
    }

    public void validateAmount(Reservation reservation, Long amount) {
        if (!reservation.getTotalPrice().equals(amount))
            throw new CustomException(PAYMENT_AMOUNT_MISMATCH);
    }
}
