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
                    "p.programInfo, " +
                    "p.programPeople, " +
                    "p.programPrice, " +
                    "pl.placePhoto1) " +
                    "FROM Program p " +
                    "JOIN Place pl ON pl.program.id = p.id"
    )
    List<ProgramCard> findProgramCards();


}
