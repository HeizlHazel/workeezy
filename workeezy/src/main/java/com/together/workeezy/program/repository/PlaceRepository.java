package com.together.workeezy.program.repository;

import com.together.workeezy.program.entity.Place;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

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

    @Query("""
                SELECT p FROM Place p 
                WHERE (:region IS NULL OR p.placeRegion = :region)
            """)
    List<Place> findByRegion(@Param("region") String region);

    @Query("SELECT p.placeRegion FROM Place p WHERE p.program.id = :programId AND p.placeType = 'stay'")
    String findRegionByProgramId(Long programId);


    String findFirstRegionByProgramId(Long programId);
}
