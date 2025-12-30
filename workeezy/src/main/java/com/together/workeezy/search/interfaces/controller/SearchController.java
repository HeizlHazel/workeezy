package com.together.workeezy.search.interfaces.controller;

import com.together.workeezy.auth.security.user.CustomUserDetails;
import com.together.workeezy.search.application.service.RecentSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/search")
public class SearchController {

    private final com.together.workeezy.search.application.service.SearchService searchService;
    private final RecentSearchService recentSearchService;

    @GetMapping
    public com.together.workeezy.search.interfaces.dto.SearchResultDto search(
            @RequestParam String keyword,
            @RequestParam(required = false) List<String> regions,
            jakarta.servlet.http.HttpServletRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long userId = (userDetails != null) ? userDetails.getUserId() : null;
        return searchService.search(keyword, regions, userId);
    }

    // ✅ 최근 검색어 조회 (Redis)
    @GetMapping("/recent")
    public List<String> recent(
            @RequestParam(defaultValue = "10") int limit,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long userId = (userDetails != null) ? userDetails.getUserId() : null;
        if (userId == null) return List.of(); // 비로그인이면 빈 배열
        return recentSearchService.getRecentKeywords(userId, Math.min(limit, 20));
    }

    // (선택) ✅ 최근 검색어 전체 삭제
    @DeleteMapping("/recent")
    public void clearRecent(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = (userDetails != null) ? userDetails.getUserId() : null;
        if (userId != null) recentSearchService.clear(userId);
    }
}
