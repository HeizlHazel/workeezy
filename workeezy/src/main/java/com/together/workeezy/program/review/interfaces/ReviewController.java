package com.together.workeezy.program.review.interfaces;

import com.together.workeezy.program.review.interfaces.dto.ReviewCreateRequest;
import com.together.workeezy.program.review.interfaces.dto.ReviewDto;
import com.together.workeezy.program.review.application.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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
    public ResponseEntity<String> createReview(
            @RequestBody ReviewCreateRequest dto,
            Authentication authentication
    ) {
        String email = authentication.getName();
        reviewService.createReview(dto, email);

        return ResponseEntity.ok("리뷰 등록 완료");
    }


}