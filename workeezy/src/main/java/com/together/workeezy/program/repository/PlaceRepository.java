package com.together.workeezy.program.repository;

import com.together.workeezy.program.entity.Place;
import com.together.workeezy.program.entity.PlaceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlaceRepository extends JpaRepository<Place, Long> {

    List<Place> findByProgramId(Long programId);

    @Query("""
                SELECT p.placePhoto1
                FROM Place p
                WHERE p.program.id = :programId
                  AND p.placeType = 'stay'
                ORDER BY p.id ASC
            """)
    List<String> findPhotosByProgramId(Long programId);



    @Query("SELECT p.placeRegion FROM Place p WHERE p.program.id = :programId AND p.placeType = 'stay'")
    String findRegionByProgramId(Long programId);

    @Query("SELECT pl FROM Place pl WHERE pl.program.id IN :programIds")
    List<Place> findByProgramIds(@Param("programIds") List<Long> programIds);

    String findFirstRegionByProgramId(Long programId);

    // 해당 프로그램의 office 하나, stay 하나 가지고 오기
    Optional<Place> findByProgramIdAndPlaceType(Long programId, PlaceType placeType);
}
