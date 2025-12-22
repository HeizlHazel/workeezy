package com.together.workeezy.search.domain.model.entity;

import com.together.workeezy.program.program.domain.model.entity.Program;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "tb_search_program")
public class SearchProgram {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "search_pg_id", nullable = false)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "search_id", nullable = false)
    private Search search;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "program_id", nullable = false)
    private Program program;

    @Column(name = "search_point")
    private Integer searchPoint;

    // ===========================
    // ✅ 생성 전용 팩토리 메서드
    // ===========================
    public static SearchProgram create(
            Search search,
            Program program,
            int searchPoint
    ) {
        SearchProgram sp = new SearchProgram();
        sp.search = search;
        sp.program = program;
        sp.searchPoint = searchPoint;
        return sp;
    }
}
