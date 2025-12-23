package com.together.workeezy.program.review.domain.model.entity;

import com.together.workeezy.program.program.domain.model.entity.Program;
import com.together.workeezy.user.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Getter
@Entity
@Table(name = "tb_review")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id", nullable = false)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "program_id", nullable = false)
    private Program program;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "review_content")
    private String content;

    @CreationTimestamp
    @Column(name = "review_date", updatable = false)
    private LocalDateTime reviewDate;

    @ColumnDefault("0")
    @Column(name = "review_point")
    private Integer reviewPoint;

    public static Review create(
            Program program,
            User user,
            String content,
            Integer reviewPoint
    ){
        Review review = new Review();
        review.program = program;
        review.user = user;
        review.content = content;
        review.reviewPoint = reviewPoint;
        review.validateReviewPoint(reviewPoint);
        return review;
    }

    public void updateContentAndPoint(String content, Integer reviewPoint) {
        validateReviewPoint(reviewPoint);
        this.content = content;
        this.reviewPoint = reviewPoint;
    }

    private void validateReviewPoint(Integer reviewPoint) {
        if (reviewPoint == null || reviewPoint < 1 || reviewPoint > 5) {
            throw new IllegalArgumentException("리뷰 점수는 1~5 사이여야 합니다.");
        }
    }

}