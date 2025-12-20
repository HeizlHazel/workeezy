package com.together.workeezy.reservation;

<<<<<<< HEAD
=======
import com.together.workeezy.payment.entity.Payment;
>>>>>>> feat/payment-create
import com.together.workeezy.program.entity.Place;
import com.together.workeezy.program.entity.Program;
import com.together.workeezy.program.entity.Room;
import com.together.workeezy.user.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private Room room;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "stay_id")
    private Place stay;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "office_id")
    private Place office;

    @NotNull
    @Column(name = "reservation_no", nullable = false, length = 20)
    private String reservationNo;

    @NotNull
    @Column(name = "start_date", nullable = false)
<<<<<<< HEAD
    private LocalDateTime startDate;

    @NotNull
    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;
=======
    private LocalDateTime  startDate;

    @NotNull
    @Column(name = "end_date", nullable = false)
    private LocalDateTime  endDate;
>>>>>>> feat/payment-create

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ReservationStatus status = ReservationStatus.waiting_payment; // waiting_payment, confirmed, cancel_requested, cancelled

    @CreationTimestamp
    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;

    @UpdateTimestamp
    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    @Column(name = "reject_reason", length = 500)
    private String rejectReason;

    @NotNull
    @Column(name = "total_price", nullable = false)
    private Long totalPrice;

    @NotNull
    @Column(name = "people_count", nullable = false)
    private int peopleCount;

<<<<<<< HEAD
=======
    @OneToOne(mappedBy = "reservation")
    private Payment payment;

>>>>>>> feat/payment-create
    @OneToMany(mappedBy = "reservation")
    private List<ReservationModify> reservationModifys = new ArrayList<>();

    @OneToMany(mappedBy = "reservation")
    private List<ReservationPdf> reservationPdfs = new ArrayList<>();


    // 상태판단 메소드

    // 사용자 예약이 맞는지
    public boolean isOwnedBy(User user) {
        return this.user.getId().equals(user.getId());
    }

    public int daysUntilStart() {
        return (int) ChronoUnit.DAYS.between(
                LocalDate.now(),
                this.startDate.toLocalDate()
        );
    }

    // 수정 가능 상태 검증
    public void validateUpdatable() {
        if (!this.status.canUpdate()) {
            throw new IllegalStateException("해당 상태에서는 수정 불가");
        }
    }

    // 시작일보다 종료일이 빨라야 함
    public void validateDate(LocalDateTime start, LocalDateTime end) {
        if (start.isAfter(end)) {
            throw new IllegalStateException("시작일은 종료일보다 늦을 수 없습니다.");
        }
    }

    // 수정

    public void changePeriod(LocalDateTime  start, LocalDateTime  end) {
        this.startDate = start;
        this.endDate = end;
    }

    public void changePeopleCount(int count) {
        this.peopleCount = count;
    }

    public void changeRoom(Room room) {
        this.room = room;
        this.stay = room.getPlace(); // stay 자동 동기화
    }

    public void changeOffice(Place office) {
        this.office = office; // null 허용
    }

    public void recalculateTotalPrice() {
        this.totalPrice = (long) this.program.getProgramPrice() * this.peopleCount;
    }

}