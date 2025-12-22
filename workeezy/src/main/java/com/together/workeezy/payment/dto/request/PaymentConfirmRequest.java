package com.together.workeezy.payment.dto.request;

import lombok.Getter;

@Getter
public class PaymentConfirmRequest {

    private String paymentKey;   // toss에서 successUrl로 전달됨
    private String orderId;      // = reservation_no
    private Long reservationId;  // db 조회용
    private Long amount;         // 검증용
}
