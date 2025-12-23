package com.together.workeezy.program.review.interfaces.dto;

public record ReviewCreateRequest(
        Long programId,
        Integer rating,
        String reviewText
) {}
