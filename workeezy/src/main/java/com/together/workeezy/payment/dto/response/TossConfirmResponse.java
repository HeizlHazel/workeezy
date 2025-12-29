package com.together.workeezy.payment.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class TossConfirmResponse {

    private String paymentKey;
    private String orderId;
    private Long Amount;
    private String method;
    private LocalDateTime approvedAt; // 문자열로 오지만 WebClient가 자동으로 LocalDateTime으로 변환함

    // 안되면 String으로 받고 LocalDateTime 파싱
}
