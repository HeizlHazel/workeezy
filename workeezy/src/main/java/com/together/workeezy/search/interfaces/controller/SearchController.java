package com.together.workeezy.search.interfaces.controller;

import com.together.workeezy.auth.security.user.CustomUserDetails;
import com.together.workeezy.search.interfaces.dto.SearchResultDto;
import com.together.workeezy.search.application.service.SearchService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/search")
public class SearchController {

    private final SearchService searchService;

    @GetMapping
    public SearchResultDto search(
            @RequestParam String keyword,
            @RequestParam(required = false) List<String> regions,
            HttpServletRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        String authHeader = request.getHeader("Authorization");
        Long userId = (userDetails != null) ? userDetails.getUserId() : null;
        return searchService.search(keyword, regions, userId);
    }


}

