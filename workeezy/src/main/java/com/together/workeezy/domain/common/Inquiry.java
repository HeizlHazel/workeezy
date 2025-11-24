package com.together.workeezy.domain.common;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "tb_inquiry")
public class Inquiry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "inquiry_id", nullable = false)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "session_id", nullable = false)
    private ChatSession session;

    @NotNull
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Lob
    @Column(name = "category")
    private String category;

    @Lob
    @Column(name = "inquiry_detail")
    private String inquiryDetail;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "inquiry_time")
    private Instant inquiryTime;

}