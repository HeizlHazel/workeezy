package com.together.workeezy.program.controller;

import com.together.workeezy.program.dto.ReviewCreateRequest;
import com.together.workeezy.program.dto.ReviewDto;
import com.together.workeezy.program.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping
    public List<ReviewDto> getAllReviews() {
        return reviewService.getReviewCards();
    }

    @PostMapping
    public ResponseEntity<String> createReview(@RequestBody ReviewCreateRequest dto) {

        reviewService.createReview(dto);
        return ResponseEntity.ok("리뷰 등록 완료");
    }

}
