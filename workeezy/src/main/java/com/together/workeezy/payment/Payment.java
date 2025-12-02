package com.together.workeezy.payment;

import com.together.workeezy.reservation.Reservation;
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
    private Integer amount;

    @NotNull
    @Lob
    @Column(name = "payment_status", nullable = false)
    private String status;

    @Size(max = 50)
    @NotNull
    @Column(name = "payment_method", nullable = false, length = 50)
    private String paymentMethod;

    @Column(name = "approved_at", updatable = false)
    private LocalDateTime approvedAt;

    @NotNull
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

}