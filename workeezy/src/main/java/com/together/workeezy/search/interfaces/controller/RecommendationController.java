package com.together.workeezy.search.interfaces.controller;

import com.together.workeezy.auth.security.jwt.JwtTokenProvider;
import com.together.workeezy.auth.security.user.CustomUserDetails;
import com.together.workeezy.program.program.interfaces.dto.ProgramCardDto;
import com.together.workeezy.search.application.service.RecommendationService;
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
