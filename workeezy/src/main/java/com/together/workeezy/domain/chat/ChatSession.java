package com.together.workeezy.domain.chat;

import com.together.workeezy.domain.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "tb_chat_session")
public class ChatSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "session_id", nullable = false)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull
    @ColumnDefault("'closed'")
    @Lob
    @Column(name = "status", nullable = false)
    private String status;

    @NotNull
    @ColumnDefault("1")
    @Column(name = "is_ai_only", nullable = false)
    private Boolean isAiOnly = false;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "create_time")
    private Instant createTime;

    @Column(name = "closed_time")
    private Instant closedTime;

    @OneToMany(mappedBy = "session")
    private Set<ChatMessage> ChatMessages = new LinkedHashSet<>();

    @OneToMany(mappedBy = "session")
    private Set<Inquiry> Inquiries = new LinkedHashSet<>();

}