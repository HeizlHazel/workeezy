package com.together.workeezy.program.review.domain.repository;

import com.together.workeezy.program.review.interfaces.dto.ReviewDto;
import com.together.workeezy.program.review.domain.model.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    // 전체 리뷰 카드 조회
    @Query("""
            SELECT new com.together.workeezy.program.review.interfaces.dto.ReviewDto(
                r.id,
                p.id,
                p.title,
                r.content,
                r.reviewPoint,
                null,
                null
            )
            FROM Review r
            JOIN r.program p
            ORDER BY r.reviewDate DESC
            """)
    List<ReviewDto> findAllReviewCards();


    // 특정 프로그램 리뷰 조회
    @Query("""
            SELECT new com.together.workeezy.program.review.interfaces.dto.ReviewDto(
                r.id,
                p.id,
                p.title,
                r.content,
                r.reviewPoint,
                null,
                null
            )
            FROM Review r
            JOIN r.program p
            WHERE p.id = :programId
            ORDER BY r.reviewDate DESC
            """)
    List<ReviewDto> findReviewCardsByProgramId(Long programId);
}
