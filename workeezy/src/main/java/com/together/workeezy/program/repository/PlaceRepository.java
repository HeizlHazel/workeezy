package com.together.workeezy.program.repository;

import com.together.workeezy.program.entity.Place;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlaceRepository extends JpaRepository<Place, Long> {

    List<Place> findByProgramId(Long programId);

    @Query("""
        SELECT p.placePhoto1
        FROM Place p
        WHERE p.program.id = :programId
        ORDER BY p.id ASC
    """)
    List<String> findPhotosByProgramId(Long programId);
}
