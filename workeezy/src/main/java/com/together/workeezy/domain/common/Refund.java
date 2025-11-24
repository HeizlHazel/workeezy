package com.together.workeezy.domain.common;

import com.together.workeezy.domain.payment.Payment;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

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
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
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
    @ColumnDefault("'pending'")
    @Lob
    @Column(name = "refund_status", nullable = false)
    private String refundStatus;

    @ColumnDefault("'user'")
    @Lob
    @Column(name = "requested_by")
    private String requestedBy;

    @Column(name = "refunded_at")
    private Instant refundedAt;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

}