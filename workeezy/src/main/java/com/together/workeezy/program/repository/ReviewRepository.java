package com.together.workeezy.program.repository;

import com.together.workeezy.program.dto.ReviewDto;
import com.together.workeezy.program.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    @Query("""
                SELECT new com.together.workeezy.program.dto.ReviewDto(
                    r.id,
                    p.id,
                    p.title,
                    r.content,
                    r.reviewPoint,
                    ''
                )
                FROM Review r
                JOIN r.program p
                ORDER BY r.reviewDate DESC
            """)
    List<ReviewDto> findAllReviewCards();

    @Query("""
            SELECT new com.together.workeezy.program.dto.ReviewDto(
                r.id,
                p.id,
                p.title,
                r.content,
                r.reviewPoint,
                ''
            )
            FROM Review r
            JOIN r.program p
            WHERE p.id = :programId
            ORDER BY r.reviewDate DESC
            """)
    List<ReviewDto> findReviewCardsByProgramId(Long programId);


}
