package com.together.workeezy.domain.common;

import com.together.workeezy.domain.login.LoginHistory;
import com.together.workeezy.domain.login.RefreshToken;
import com.together.workeezy.domain.login.UserSocialLogin;
import com.together.workeezy.domain.reservation.Reservation;
import com.together.workeezy.domain.reservation.ReservationModify;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;
import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

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
    @Column(name = "email", nullable = false, length = 100)
    private String email;

    @Size(max = 255)
    @NotNull
    @Column(name = "user_pwd", nullable = false)
    private String userPwd;

    @Size(max = 100)
    @NotNull
    @Column(name = "user_name", nullable = false, length = 100)
    private String userName;

    @Size(max = 20)
    @Column(name = "phone", length = 20)
    private String phone;

    @NotNull
    @Column(name = "birth", nullable = false)
    private LocalDate birth;

    @Size(max = 30)
    @NotNull
    @Column(name = "company", nullable = false, length = 30)
    private String company;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @NotNull
    @ColumnDefault("'user'")
    @Lob
    @Column(name = "user_role", nullable = false)
    private String userRole;

    @OneToMany
    @JoinColumn(name = "user_id")
    private Set<ChatSession> tbChatSessions = new LinkedHashSet<>();

    @OneToMany
    @JoinColumn(name = "user_id")
    private Set<LoginHistory> LoginHistories = new LinkedHashSet<>();

    @OneToOne
    @JoinColumn(name = "user_id")
    private RefreshToken RefreshToken;

    @OneToMany
    @JoinColumn(name = "user_id")
    private Set<Reservation> Reservations = new LinkedHashSet<>();

    @OneToMany
    @JoinColumn(name = "user_id")
    private Set<ReservationModify> ReservationModifies = new LinkedHashSet<>();

    @OneToMany
    @JoinColumn(name = "user_id")
    private Set<UserSocialLogin> UserSocialLogins = new LinkedHashSet<>();

}