package com.together.workeezy.domain.common;

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
@Table(name = "tb_notification")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "noti_id", nullable = false)
    private Long id;

    @NotNull
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Size(max = 200)
    @Column(name = "noti_title", length = 200)
    private String notiTitle;

    @Lob
    @Column(name = "noti_msg")
    private String notiMsg;

    @Lob
    @Column(name = "noti_type")
    private String notiType;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "sent_time")
    private Instant sentTime;

    @Lob
    @Column(name = "status")
    private String status;

}