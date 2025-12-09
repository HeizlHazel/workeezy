package com.together.workeezy.program.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ReviewDto {
    private Long reviewId;
    private Long programId;        // 상세 이동용
    private String programName;    // 프로그램명
    private String reviewText;     // 리뷰 내용
    private Integer rating;        // 별점
    private String image;
}

