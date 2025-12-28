package com.together.workeezy.payment.dto.response;

import com.together.workeezy.payment.enums.PaymentMethod;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
public class TossConfirmResponse {

    private String paymentKey;
    private String orderId;
    private Long Amount;
    private PaymentMethod method;
    private OffsetDateTime approvedAt; // 안되면 String으로 받고 LocalDateTime 파싱
}
