package com.together.workeezy.domain.reservation;

import com.together.workeezy.domain.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.Map;

@Getter @Setter
@Entity
@Table(name = "tb_reservation_modify")
public class ReservationModify {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "modify_request_id", nullable = false)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull
    @Column(name = "after_data", nullable = false)
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> afterData;

    @NotNull
    @Column(name = "status", nullable = false)
    @Enumerated
    private ReservationModifyStatus status;

    @Size(max = 225)
    @Column(name = "reject_reason", length = 225)
    private String rejectReason;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "request_at", nullable = false)
    private Instant requestAt;

    @Column(name = "processed_at")
    private Instant processedAt;

}