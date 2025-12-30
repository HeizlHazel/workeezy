package com.together.workeezy.payment.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PaymentReadyResponse {

    private String reservationNo;
    private String programTitle;
    private Long totalPrice;

}
