package com.together.workeezy.payment.entity;

import com.together.workeezy.common.exception.CustomException;
import com.together.workeezy.common.exception.ErrorCode;
import com.together.workeezy.payment.enums.PaymentStatus;
import com.together.workeezy.payment.repository.PaymentRepository;
import com.together.workeezy.payment.service.PaymentValidator;
import com.together.workeezy.reservation.Reservation;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Getter
@Entity
@Table(name = "tb_payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id", nullable = false)
    private Long id;

    @NotNull
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;

    @Size(max = 100)
    @Column(name = "order_id", length = 100)
    private String orderId;

    @Size(max = 200)
    @Column(name = "payment_key", length = 200)
    private String paymentKey;

    @NotNull
    @Column(name = "amount", nullable = false)
    private Long amount;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false)
    private PaymentStatus status; // ready, paid, cancelled, failed

    @Size(max = 50)
    @NotNull
    @Column(name = "payment_method", nullable = false, length = 50)
    private String method;

    // 결제 승인 시각
    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    // 결제 요청 시각
    @NotNull
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    protected Payment() {}

    // 결제 생성
    public static Payment create(Reservation reservation, Long amount) {
        Payment p = new Payment();
        p.reservation = reservation;
        p.amount = amount;
        p.status = PaymentStatus.ready;

        reservation.linkPayment(p);

        return p;
    }

    // 결제 승인
    public void approve(
            String orderId,
            String paymentKey,
            Long amount,
            String method,
            LocalDateTime approvedAt) {

        if (this.status == PaymentStatus.paid) {
            throw new CustomException(ErrorCode.PAYMENT_ALREADY_COMPLETED);
        }

        this.orderId = orderId;
        this.paymentKey = paymentKey;
        this.amount = amount;
        this.method = method;
        this.approvedAt = approvedAt;
        this.status = PaymentStatus.paid;
    }
}