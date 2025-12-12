package com.together.workeezy.search.controller;

import com.together.workeezy.auth.security.CustomUserDetails;
import com.together.workeezy.search.dto.SearchResultDto;
import com.together.workeezy.search.service.SearchService;
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
        System.out.println("👉 Authorization 헤더 = " + authHeader);
        System.out.println("👉 userDetails = " + userDetails);
        System.out.println("👉 userId = " + (userDetails != null ? userDetails.getUserId() : null));
        Long userId = (userDetails != null) ? userDetails.getUserId() : null;


        return searchService.search(keyword, regions, userId);
    }


}

