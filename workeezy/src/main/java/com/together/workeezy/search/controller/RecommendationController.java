package com.together.workeezy.search.controller;

import com.together.workeezy.auth.security.jwt.JwtTokenProvider;
<<<<<<< HEAD
=======
import com.together.workeezy.auth.security.user.CustomUserDetails;
>>>>>>> feat/payment-create
import com.together.workeezy.program.dto.ProgramCardDto;
import com.together.workeezy.search.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;
    private final JwtTokenProvider jwtTokenProvider;

    @GetMapping("/recent")
    public List<ProgramCardDto> getRecentRecommendations(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long userId = (userDetails != null) ? userDetails.getUserId() : null;
        return recommendationService.recommendByRecentSearch(userId);
    }



}
