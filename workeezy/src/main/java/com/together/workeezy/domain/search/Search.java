package com.together.workeezy.domain.search;

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
@Table(name = "tb_search")
public class Search {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "search_id", nullable = false)
    private Long id;

    @NotNull
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "searchPG_id", nullable = false)
    private SearchProgram searchPG;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "search_time")
    private Instant searchTime;

    @Size(max = 100)
    @Column(name = "search_phrase", length = 100)
    private String searchPhrase;

}