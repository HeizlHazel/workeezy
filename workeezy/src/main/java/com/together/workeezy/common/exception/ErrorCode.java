package com.together.workeezy.common.exception;

import org.springframework.http.HttpStatus;

public enum ErrorCode {

    // 예약/결제
    RESERVATION_NOT_FOUND(HttpStatus.NOT_FOUND, "예약을 찾을 수 없습니다."),
    FORBIDDEN_ACCESS(HttpStatus.FORBIDDEN, "해당 예약에 접근 권한이 없습니다."),

    PAYMENT_AMOUNT_MISMATCH(HttpStatus.BAD_REQUEST, "결제 금액이 일치하지 않습니다."),
    PAYMENT_KEY_MISSING(HttpStatus.BAD_REQUEST, "paymentKey가 없습니다."),
    ORDER_ID_MISSING(HttpStatus.BAD_REQUEST, "orderId가 없습니다."),
    AMOUNT_INVALID(HttpStatus.BAD_REQUEST, "금액이 올바르지 않습니다."),
    PAYMENT_ALREADY_COMPLETED(HttpStatus.CONFLICT, "이미 결제된 예약입니다."),
    ORDER_ID_MISMATCH(HttpStatus.BAD_REQUEST, "주문 번호가 일치하지 않습니다."),
    PAYMENT_NOT_FOUND(HttpStatus.NOT_FOUND, "결제 정보가 존재하지 않습니다."),

    // 사용자
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."),

    // 인증/인가
    AUTH_REFRESH_TOKEN_NOT_FOUND(HttpStatus.UNAUTHORIZED, "Refresh token 찾을 수 없음"),
    AUTH_REFRESH_TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "Refresh token 만료 또는 위조"),
    AUTH_REFRESH_TOKEN_NOT_SAVED(HttpStatus.UNAUTHORIZED, "서버에 Refresh Token 없음(로그아웃된 사용자)"),
    AUTH_REFRESH_TOKEN_MISMATCH(HttpStatus.UNAUTHORIZED, "Refresh Token 불일치(탈취/중복 로그인 가능)"),

    PASSWORD_NOT_MATCH(HttpStatus.BAD_REQUEST, "현재 비밀번호가 일치하지 않습니다."),
    PASSWORD_CONFIRM_NOT_MATCH(HttpStatus.BAD_REQUEST, "새 비밀번호가 서로 일치하지 않습니다."),

    INVALID_PASSWORD_LENGTH(HttpStatus.BAD_REQUEST, "비밀번호는 8~16자여야 합니다."),
    INVALID_PASSWORD_NUMBER(HttpStatus.BAD_REQUEST, "숫자가 포함되어야 합니다."),
    INVALID_PASSWORD_UPPER(HttpStatus.BAD_REQUEST, "대문자가 포함되어야 합니다."),
    INVALID_PASSWORD_LOWER(HttpStatus.BAD_REQUEST, "소문자가 포함되어야 합니다."),
    INVALID_PASSWORD_SPECIAL(HttpStatus.BAD_REQUEST, "특수문자가 포함되어야 합니다."),

    PAYMENT_NOT_ALLOWED(HttpStatus.BAD_REQUEST, "승인 후 결제 가능합니다."),
    PAYMENT_LOG_SERIALIZE_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "결제 로그 직렬화에 실패했습니다.");

    private final HttpStatus status;
    private final String message;

    ErrorCode(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }
}