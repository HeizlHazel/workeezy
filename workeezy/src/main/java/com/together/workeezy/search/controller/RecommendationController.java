package com.together.workeezy.search.controller;

import com.together.workeezy.auth.security.jwt.JwtTokenProvider;
import com.together.workeezy.program.dto.ProgramCardDto;
import com.together.workeezy.search.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;
    private final JwtTokenProvider jwtTokenProvider;

    @GetMapping("/recent")
    public List<ProgramCardDto> getRecentRecommendations(
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {

        // 1) 비로그인 → 빈 배열 리턴
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return Collections.emptyList();
        }

        String token = authHeader.substring(7);

        // 2) 토큰 검증 실패 → 빈 배열
        if (!jwtTokenProvider.validateToken(token)) {
            return Collections.emptyList();
        }

        // 3) 토큰에서 userId 추출
        Long userId = jwtTokenProvider.getUserIdFromToken(token);

        // 4) 최근 검색어 기반 추천
        return recommendationService.recommendByRecentSearch(userId);
    }
}
