package com.together.workeezy.chat;

import com.together.workeezy.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;
import java.time.LocalDateTime;

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
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Size(max = 200)
    @Column(name = "noti_title", length = 200)
    private String notiTitle;

    @Lob
    @Column(name = "noti_msg")
    private String notiMsg;

    @Lob
    @Column(name = "noti_type")
    private String notiType;

    @CreationTimestamp
    @Column(name = "sent_time", updatable = false)
    private LocalDateTime sentTime;

    @Lob
    @Column(name = "status")
    private String status;

}