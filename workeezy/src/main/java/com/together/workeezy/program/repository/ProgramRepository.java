package com.together.workeezy.program.repository;

import com.together.workeezy.program.dto.ProgramCard;
import com.together.workeezy.program.entity.Program;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ProgramRepository extends JpaRepository<Program, Long> {

    @Query(
            "SELECT new com.together.workeezy.program.dto.ProgramCard(" +
                    "p.id, " +
                    "p.title, " +
                    "(SELECT pl.placePhoto1 FROM Place pl " +
                    "WHERE pl.program.id = p.id " +
                    "AND pl.placeType = 'STAY' " +
                    "AND pl.id = (" +
                    "SELECT MIN(pl2.id) FROM Place pl2 " +
                    "WHERE pl2.program.id = p.id AND pl2.placeType = 'STAY'" +
                    ")" +
                    "), " +
                    "p.programPrice" +
                    ") " +
                    "FROM Program p"
    )

    List<ProgramCard> findProgramCards();




}
