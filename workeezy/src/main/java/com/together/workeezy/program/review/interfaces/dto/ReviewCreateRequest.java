package com.together.workeezy.program.review.interfaces.dto;

public record ReviewCreateRequest(
        Long userId,
        Long programId,
        Integer rating,
        String reviewText
) {}
