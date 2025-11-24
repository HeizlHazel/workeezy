package com.together.workeezy.domain.program;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "tb_search")
public class Search {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "search_id")
    private Long id;

    @NotNull
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "search_time")
    private Instant searchTime;

    @Column(name = "search_phrase", length = 100)
    private String searchPhrase;

    @OneToMany(mappedBy = "search")
    private List<SearchProgram> searchPrograms = new ArrayList<>();

}