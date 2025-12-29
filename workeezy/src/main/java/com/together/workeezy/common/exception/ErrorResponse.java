package com.together.workeezy.common.exception;
import lombok.Getter;

@Getter
public class ErrorResponse {
    private final String code;
    private final String message;
    private final String detail;

    public ErrorResponse(ErrorCode errorCode) {
        this.code = errorCode.name();
        this.message = errorCode.getMessage();
        this.detail = errorCode.getDetail();
    }
}
