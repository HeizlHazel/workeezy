package com.together.workeezy.payment.entity;

import com.together.workeezy.payment.enums.RefundStatus;
import com.together.workeezy.payment.enums.RequestedBy;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "tb_refund")
public class Refund {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "refund_id", nullable = false)
    private Long id;

    @NotNull
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "payment_id", nullable = false)
    private Payment payment;

    @NotNull
    @Column(name = "refund_amount", nullable = false)
    private Integer refundAmount;

    @Size(max = 200)
    @Column(name = "refund_reason", length = 200)
    private String refundReason;

    @Size(max = 200)
    @Column(name = "cancel_key", length = 200)
    private String cancelKey;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "refund_status", nullable = false)
    private RefundStatus refundStatus =  RefundStatus.pending;

    @Enumerated(EnumType.STRING)
    @Column(name = "requested_by")
    private RequestedBy requestedBy = RequestedBy.user;

    @Column(name = "refunded_at")
    private LocalDateTime refundedAt;

    @NotNull
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

}