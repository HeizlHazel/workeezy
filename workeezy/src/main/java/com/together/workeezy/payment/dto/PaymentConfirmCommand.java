package com.together.workeezy.payment.dto;

public record PaymentConfirmCommand(
        String orderId,
        String paymentKey,
        Long amount,
        String userEmail
) {
}