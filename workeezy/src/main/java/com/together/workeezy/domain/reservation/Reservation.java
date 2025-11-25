package com.together.workeezy.domain.reservation;

import com.together.workeezy.domain.payment.Payment;
import com.together.workeezy.domain.program.Program;
import com.together.workeezy.domain.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;

import static jakarta.persistence.FetchType.LAZY;


@Entity
@Table(name = "tb_reservation")
@Getter @Setter
public class Reservation {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reservation_id", nullable = false)
    private Long id;

    @NotNull
    @ManyToOne(fetch = LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull
    @ManyToOne(fetch = LAZY, optional = false)
    @JoinColumn(name = "program_id", nullable = false)
    private Program program;

    @NotNull
    @Column(name = "reservation_no", nullable = false, length = 20)
    private String reservationNo;

    @NotNull
    @Column(name = "start_date", nullable = false)
    private Instant startDate;

    @NotNull
    @Column(name = "end_date", nullable = false)
    private Instant endDate;

    @NotNull
    @Enumerated(EnumType.STRING)
    @ColumnDefault("WAITING")
    @Column(name = "status", nullable = false)
    private ReservationStatus status;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_date", nullable = false)
    private Instant createdDate;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "updated_date")
    private Instant updatedDate;

    @NotNull
    @Column(name = "total_price", nullable = false)
    private Long totalPrice;

    @OneToOne(mappedBy = "reservation")
    private Payment Payment;

    @OneToMany(mappedBy = "reservation")
    private Set<ReservationModify> ReservationModifies = new LinkedHashSet<>();

    @OneToMany(mappedBy = "reservation")
    private Set<ReservationPdf> ReservationPdfs = new LinkedHashSet<>();

}