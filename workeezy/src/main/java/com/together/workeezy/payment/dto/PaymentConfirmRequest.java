package com.together.workeezy.payment.dto;

import lombok.Getter;

@Getter
public class PaymentConfirmRequest {

    private String paymentKey;
    private String orderId;
    private Long reservationId;
    private Long amount;
}
