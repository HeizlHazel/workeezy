package com.together.workeezy.payment.enums;

public enum PaymentMethod {
    unknown, card, transfer, easy_pay;

    public static PaymentMethod from(String value) {
        if (value == null || value.isBlank()) return unknown;

        String normalized = value.trim().toLowerCase();

        // easy-pay 등 변형 처리
        normalized = normalized.replace("-", "_");

        try {
            return PaymentMethod.valueOf(normalized);
        } catch (IllegalArgumentException e) {
            return unknown;
        }
    }
}
