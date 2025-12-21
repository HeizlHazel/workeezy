package com.together.workeezy.common.exception;

public enum ErrorCode {

    RESERVATION_NOT_FOUND("예약을 찾을 수 없습니다."),
    FORBIDDEN_ACCESS("해당 예약에 접근 권한이 없습니다."),
    PAYMENT_AMOUNT_MISMATCH("결제 금액이 일치하지 않습니다."),
    PAYMENT_KEY_MISSING("paymentKey가 없습니다."),
    ORDER_ID_MISSING("orderId가 없습니다."),
    AMOUNT_INVALID("금액이 올바르지 않습니다."),
    PAYMENT_ALREADY_COMPLETED("이미 결제된 예약입니다."),
    ORDER_ID_MISMATCH("주문 번호가 일치하지 않습니다."),
    PAYMENT_NOT_FOUND("결제 정보가 존재하지 않습니다."),

    USER_NOT_FOUND("사용자를 찾을 수 없습니다."),

    AUTH_REFRESH_TOKEN_EXPIRED("Refresh token 만료 또는 위조"),
    AUTH_REFRESH_TOKEN_NOT_SAVED("서버에 Refresh Token 없음(로그아웃된 사용자)"),
    AUTH_REFRESH_TOKEN_MISMATCH("Refresh Token 불일치(탈취/중복 로그인 가능)"),

    PASSWORD_NOT_MATCH("현재 비밀번호가 일치하지 않습니다."),
    PASSWORD_CONFIRM_NOT_MATCH("새 비밀번호가 서로 일치하지 않습니다."),

    INVALID_PASSWORD_LENGTH("비밀번호는 8~16자여야 합니다."),
    INVALID_PASSWORD_NUMBER("숫자가 포함되어야 합니다."),
    INVALID_PASSWORD_UPPER("대문자가 포함되어야 합니다."),
    INVALID_PASSWORD_LOWER("소문자가 포함되어야 합니다."),
    INVALID_PASSWORD_SPECIAL("특수문자가 포함되어야 합니다.");

    private final String message;

    ErrorCode(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}