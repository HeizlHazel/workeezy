package com.together.workeezy.payment.dto;

public record PaymentConfirmCommand(
        Long reservationId,
        String orderId,
        String paymentKey,
        Long amount,
        String userEmail
) {
}