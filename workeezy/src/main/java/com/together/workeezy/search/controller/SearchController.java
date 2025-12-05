package com.together.workeezy.search.controller;

import com.together.workeezy.search.dto.SearchResultDto;
import com.together.workeezy.search.service.SearchService;
import lombok.RequiredArgsConstructor;
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
            @RequestParam(required = false) Long userId
    ) {
        return searchService.search(keyword, regions, userId);
    }


}

