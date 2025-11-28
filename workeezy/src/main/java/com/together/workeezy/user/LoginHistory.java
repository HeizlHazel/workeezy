package com.together.workeezy.user;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "tb_login_history")
public class LoginHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "history_id", nullable = false)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Size(max = 45)
    @NotNull
    @Column(name = "login_ip", nullable = false, length = 45)
    private String loginIp;

    @NotNull
    @CreationTimestamp
    @Column(name = "login_at", nullable = false, updatable = false)
    private LocalDateTime loginAt;

    @Size(max = 512)
    @NotNull
    @Column(name = "user_agent", nullable = false, length = 512)
    private String userAgent;

    @NotNull
    @Lob
    @Column(name = "login_status", nullable = false)
    private String loginStatus;

    @Size(max = 100)
    @Column(name = "fail_reason", length = 100)
    private String failReason;

}