package com.together.workeezy.domain.search;

import com.together.workeezy.domain.program.Program;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "tb_search_program")
public class SearchProgram {
    @Id
    @Column(name = "searchPG_id", nullable = false)
    private Long id;

    @Column(name = "searchPoint")
    private Integer searchPoint;

    @OneToMany(mappedBy = "searchPG")
    private Set<Program> Programs = new LinkedHashSet<>();

    @OneToMany(mappedBy = "searchPG")
    private Set<Search> Searches = new LinkedHashSet<>();

}