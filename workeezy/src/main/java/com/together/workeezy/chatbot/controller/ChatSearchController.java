package com.together.workeezy.chatbot.controller;

import com.together.workeezy.search.application.service.SearchService;
import com.together.workeezy.search.interfaces.dto.SearchResultDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chat")
public class ChatSearchController {

    private final SearchService searchService;

    /**
     * 챗봇 전용 검색 (비로그인, region 개념 없음)
     */
    @GetMapping("/search")
    public SearchResultDto chatSearch(@RequestParam String keyword) {
        // userId = null → 검색 기록/추천 로직 자동 스킵
        return searchService.search(keyword, null, null);
    }
}
