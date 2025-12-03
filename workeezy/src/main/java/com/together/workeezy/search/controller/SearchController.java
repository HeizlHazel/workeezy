package com.together.workeezy.search.controller;

import com.together.workeezy.search.dto.SearchResultDto;
import com.together.workeezy.search.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class SearchController {

    private final SearchService searchService;

    @GetMapping("/search")
    public SearchResultDto search(
            @RequestParam String keyword,
            @RequestParam Long userId
    ) {
        return searchService.search(keyword, userId);
    }
}
