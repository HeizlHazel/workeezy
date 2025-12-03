package com.together.workeezy.user.entity;

import com.together.workeezy.reservation.Reservation;
import com.together.workeezy.reservation.ReservationModify;
import com.together.workeezy.user.enums.UserRole;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "tb_users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", nullable = false)
    private Long id;

    @Size(max = 100)
    @NotNull
    @Column(nullable = false, length = 100)
    private String email;

    @Size(max = 255)
    @NotNull
    @Column(name = "user_pwd", nullable = false)
    private String password;

    @Size(max = 100)
    @NotNull
    @Column(name = "user_name", nullable = false, length = 100)
    private String userName;

    @Size(max = 20)
    @Column(length = 20)
    private String phone;

    @NotNull
    @Column(nullable = false)
    private LocalDate birth;

    @Size(max = 30)
    @NotNull
    @Column(nullable = false, length = 30)
    private String company;

    @NotNull
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "user_role", nullable = false)
    private UserRole role; // USER, ADMIN

    @OneToMany
    @JoinColumn(name = "user_id")
    private List<Reservation> reservations = new ArrayList<>();

    @OneToMany
    @JoinColumn(name = "user_id")
    private List<ReservationModify> reservationModifys = new ArrayList<>();

}