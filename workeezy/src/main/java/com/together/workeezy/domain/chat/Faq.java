package com.together.workeezy.domain.chat;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "tb_faq")
public class Faq {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "faq_id", nullable = false)
    private Long id;

    @Size(max = 100)
    @Column(name = "intent_name", length = 100)
    private String intentName;

    @Lob
    @Column(name = "example_phrases")
    private String examplePhrases;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "create_time")
    private Instant createTime;

    @OneToMany(mappedBy = "faq")
    private Set<ChatMessage> ChatMessages = new LinkedHashSet<>();

}