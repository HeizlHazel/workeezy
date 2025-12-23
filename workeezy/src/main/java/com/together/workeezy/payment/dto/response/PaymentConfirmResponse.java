package com.together.workeezy.payment.dto.response;

import com.together.workeezy.payment.entity.Payment;
import com.together.workeezy.reservation.Reservation;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class PaymentConfirmResponse {

    private String paymentKey;
    private String orderId;
    private Long amount;
    private String method;
    private LocalDateTime approvedAt;
    private String reservationNo;

    public static PaymentConfirmResponse of(Payment payment, Reservation reservation) {
        PaymentConfirmResponse res = new PaymentConfirmResponse();
        res.paymentKey = payment.getPaymentKey();
        res.orderId = payment.getOrderId();
        res.amount = payment.getAmount();
        res.method = payment.getMethod();
        res.approvedAt = payment.getApprovedAt();
        res.reservationNo = reservation.getReservationNo();
        return res;
    }
}
