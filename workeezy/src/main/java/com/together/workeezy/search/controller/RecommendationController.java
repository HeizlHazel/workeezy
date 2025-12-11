package com.together.workeezy.search.controller;

import com.together.workeezy.auth.security.CustomUserDetails;
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

    @GetMapping("/recent")
    public List<ProgramCardDto> recommendByRecentSearch(
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        Long userId = user != null ? user.getUserId() : null;

        return recommendationService.recommendByRecentSearch(userId);
    }
}
