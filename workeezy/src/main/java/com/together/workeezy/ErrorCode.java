package com.together.workeezy;

public enum ErrorCode {

    RESERVATION_NOT_FOUND("예약을 찾을 수 없습니다."),
    FORBIDDEN_ACCESS("해당 예약에 접근 권한이 없습니다."),
    PAYMENT_AMOUNT_MISMATCH("결제 금액이 일치하지 않습니다."),
    PAYMENT_KEY_MISSING("paymentKey가 없습니다."),
    ORDER_ID_MISSING("orderId가 없습니다."),
    AMOUNT_INVALID("금액이 올바르지 않습니다."),
    PAYMENT_ALREADY_COMPLETED("이미 결제된 예약입니다.");

    private final String message;

    ErrorCode(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}