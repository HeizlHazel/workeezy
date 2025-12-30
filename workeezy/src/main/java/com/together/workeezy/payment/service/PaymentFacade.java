package com.together.workeezy.payment.service;

import com.together.workeezy.payment.dto.PaymentConfirmCommand;
import com.together.workeezy.payment.dto.request.PaymentConfirmRequest;
import com.together.workeezy.payment.dto.response.PaymentConfirmResponse;
import com.together.workeezy.payment.dto.response.PaymentReadyResponse;
import com.together.workeezy.reservation.domain.Reservation;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PaymentFacade {

    private final PaymentConfirmUseCase confirmUseCase;
    private final PaymentValidator paymentValidator;

    // 결제 진입
    @Transactional(readOnly = true)
    public PaymentReadyResponse getPaymentReadyInfo(
            Long reservationId,
            Long userId
    ) {
        Reservation reservation =
                paymentValidator.validatePayable(reservationId, userId);

        return new PaymentReadyResponse(
                reservation.getReservationNo(),
                reservation.getProgram().getTitle(),
                reservation.getTotalPrice()
        );
    }

    public PaymentConfirmResponse confirm(PaymentConfirmRequest request, String userEmail) {

        PaymentConfirmCommand command = new PaymentConfirmCommand(
                request.getOrderId(),
                request.getPaymentKey(),
                request.getAmount(),
                userEmail
        );
        return confirmUseCase.confirm(command);
    }
}
