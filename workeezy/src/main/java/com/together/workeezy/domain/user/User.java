package com.together.workeezy.domain.user;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;
import java.time.LocalDate;

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
    private String userPwd;

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
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "user_role", nullable = false)
    @ColumnDefault("'user'")
    private UserRole userRole; // USER, ADMIN

}