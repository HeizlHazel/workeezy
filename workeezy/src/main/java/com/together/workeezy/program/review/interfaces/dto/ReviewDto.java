package com.together.workeezy.program.review.interfaces.dto;

import lombok.Getter;

@Getter
public class ReviewDto {

    private final Long reviewId;
    private final Long programId;        // 상세 이동용
    private final String programName;    // 프로그램명
    private final String reviewText;     // 리뷰 내용
    private final Integer rating;        // 별점
    private final String image;          // 대표 이미지
    private final String region;         // 지역 정보

    public ReviewDto(
            Long reviewId,
            Long programId,
            String programName,
            String reviewText,
            Integer rating,
            String image,
            String region
    ) {
        this.reviewId = reviewId;
        this.programId = programId;
        this.programName = programName;
        this.reviewText = reviewText;
        this.rating = rating;
        this.image = image;
        this.region = region;
    }

    // ⭐️ 기존 DTO에 region/image만 채운 새 DTO 생성용
    public ReviewDto withRegionAndImage(String region, String image) {
        return new ReviewDto(
                this.reviewId,
                this.programId,
                this.programName,
                this.reviewText,
                this.rating,
                image,
                region
        );
    }
}
