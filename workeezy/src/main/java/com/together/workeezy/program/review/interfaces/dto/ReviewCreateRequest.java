package com.together.workeezy.program.review.interfaces.dto;

import lombok.Data;

@Data
public class ReviewCreateRequest {
    private Long userId;
    private Long programId;
    private Integer rating;
    private String reviewText;
}
