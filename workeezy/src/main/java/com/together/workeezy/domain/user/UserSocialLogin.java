package com.together.workeezy.domain.user;

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
@Table(name = "tb_user_social_login")
public class UserSocialLogin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "social_id", nullable = false)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Lob
    @Column(name = "provider")
    private String provider;

    @Size(max = 255)
    @Column(name = "provider_user_id")
    private String providerUserId;

    @Size(max = 100)
    @Column(name = "email", length = 100)
    private String email;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

}