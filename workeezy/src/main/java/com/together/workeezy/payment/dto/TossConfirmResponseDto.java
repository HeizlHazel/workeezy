package com.together.workeezy.payment.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class TossConfirmResponseDto {

    private String paymentKey;
    private String orderId;
    private Integer totalAmount;
    private String method;
    private LocalDateTime approvedAt; // 문자열로 오지만 WebClient가 자동으로 LocalDateTime으로 변환함
    // 안되면 String으로 받고 LocalDateTime 파싱
}
