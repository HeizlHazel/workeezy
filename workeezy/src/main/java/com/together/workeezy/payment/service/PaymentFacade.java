package com.together.workeezy.payment.service;

import com.together.workeezy.payment.dto.PaymentConfirmCommand;
import com.together.workeezy.payment.dto.request.PaymentConfirmRequest;
import com.together.workeezy.payment.dto.response.PaymentConfirmResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentFacade {

    private final PaymentConfirmUseCase confirmUseCase;

    public PaymentConfirmResponse confirm(PaymentConfirmRequest request, String userEmail) {

        PaymentConfirmCommand command = new PaymentConfirmCommand(
                request.getReservationId(),
                request.getOrderId(),
                request.getPaymentKey(),
                request.getAmount(),
                userEmail
        );
        return confirmUseCase.confirm(command);
    }
}
