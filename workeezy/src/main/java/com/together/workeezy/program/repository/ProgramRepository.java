package com.together.workeezy.program.repository;

import com.together.workeezy.program.entity.Program;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProgramRepository extends JpaRepository<Program, Long> {

    @Query("""
        SELECT p FROM Program p
        WHERE p.title LIKE %:keyword%
           OR p.programInfo LIKE %:keyword%
    """)
    List<Program> searchByKeyword(@Param("keyword") String keyword);

}
