package com.together.workeezy.program.program.domain.repository;

import com.together.workeezy.program.program.interfaces.dto.ProgramCardView;
import com.together.workeezy.program.program.domain.model.entity.Program;
import com.together.workeezy.search.interfaces.dto.ProgramIndexRow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProgramRepository extends JpaRepository<Program, Long> {

    // ✅ 추천 점수 계산용: Program 엔티티 말고 ID만 뽑기 (쿼리 가벼워짐)
    @Query("""
                SELECT DISTINCT p.id
                FROM Program p
                JOIN p.places pl
                WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(pl.placeRegion) LIKE LOWER(CONCAT('%', :keyword, '%'))
            """)
    List<Long> searchProgramIdsByKeyword(@Param("keyword") String keyword);

    // ✅ fallback/카드용: 최신 카드 N개 (MySQL 기준 native)
    @Query(value = """
              SELECT
                p.program_id      AS id,
                p.program_title   AS title,
                sp.place_photo1   AS photo,
                p.program_price   AS price,
                sp.place_region   AS region
              FROM tb_program p
              LEFT JOIN (
                SELECT x.program_id, x.place_photo1, x.place_region
                FROM tb_place x
                JOIN (
                  SELECT program_id, MIN(place_id) AS min_place_id
                  FROM tb_place
                  WHERE place_type = 'stay'
                  GROUP BY program_id
                ) m ON m.program_id = x.program_id AND m.min_place_id = x.place_id
                WHERE x.place_type = 'stay'
              ) sp ON sp.program_id = p.program_id
              ORDER BY p.program_id ASC
              LIMIT :limit
            """, nativeQuery = true)
    List<ProgramCardView> findAllProgramCardsOrderByIdAsc(@Param("limit") int limit);


    // ✅ 추천 결과(IDs) → 카드 한방 변환
    @Query(value = """
              SELECT
                p.program_id      AS id,
                p.program_title   AS title,
                sp.place_photo1   AS photo,
                p.program_price   AS price,
                sp.place_region   AS region
              FROM tb_program p
              LEFT JOIN (
                SELECT x.program_id, x.place_photo1, x.place_region
                FROM tb_place x
                JOIN (
                  SELECT program_id, MIN(place_id) AS min_place_id
                  FROM tb_place
                  WHERE place_type = 'stay'
                  GROUP BY program_id
                ) m ON m.program_id = x.program_id AND m.min_place_id = x.place_id
                WHERE x.place_type = 'stay'
              ) sp ON sp.program_id = p.program_id
              WHERE p.program_id IN (:ids)
            """, nativeQuery = true)
    List<ProgramCardView> findProgramCardsByIds(@Param("ids") List<Long> ids);

    @Query("""
                SELECT DISTINCT p
                FROM Program p
                JOIN p.places pl
                WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(pl.placeRegion) LIKE LOWER(CONCAT('%', :keyword, '%'))
            """)
    List<Program> searchByKeyword(@Param("keyword") String keyword);

    @Query("""
                SELECT new com.together.workeezy.search.interfaces.dto.ProgramIndexRow(
                    p.id,
                    p.title,
                    p.programInfo,
                    p.programPrice,
                    pl.placeRegion,
                    pl.placePhoto1
                )
                FROM Program p
                LEFT JOIN Place pl
                  ON pl.program.id = p.id
                WHERE pl.id = (
                    SELECT MIN(pl2.id)
                    FROM Place pl2
                    WHERE pl2.program.id = p.id
                )
            """)
    List<ProgramIndexRow> findProgramIndexRows();

}
