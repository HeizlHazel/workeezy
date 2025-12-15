package com.together.workeezy.program.repository;

import com.together.workeezy.program.entity.Program;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProgramRepository extends JpaRepository<Program, Long> {



    @Query("""
    SELECT DISTINCT p
    FROM Program p
    JOIN p.places pl
    WHERE 
        LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
        OR LOWER(pl.placeRegion) LIKE LOWER(CONCAT('%', :keyword, '%'))
""")
    List<Program> searchByKeyword(@Param("keyword") String keyword);



    // 정확한 워케이션명으로 단일 조회
    Optional<Program> findByTitle(String title);


}
