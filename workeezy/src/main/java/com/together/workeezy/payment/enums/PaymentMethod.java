package com.together.workeezy.payment.enums;

public enum PaymentMethod {
    unknown, card, transfer, easy_pay;

    public static PaymentMethod fromToss(String v) {
        if (v == null) return unknown;
        return switch (v.trim()) {
            case "카드" -> card;
            case "계좌이체" -> transfer;
            case "간편결제" -> easy_pay;
            default -> unknown;
        };
    }
}