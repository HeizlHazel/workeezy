package com.together.workeezy.search.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecentSearchService {

    // RedisConfig에서 만든 String-String 템플릿
    private final RedisTemplate<String, String> redisTemplate;

    // 최근 검색어 최대 개수
    private static final int MAX_RECENT_KEYWORDS = 10;

    // 저장 유지 기간 (선택)
    private static final long TTL_DAYS = 30L;

    private String getKey(Long userId) {
        return "recent:search:" + userId;   // 예: recent:search:5
    }

    /**
     * 최근 검색어 저장
     */
    public void saveKeyword(Long userId, String keyword) {
        if (userId == null || keyword == null || keyword.isBlank()) {
            return;
        }

        String key = getKey(userId);

        // 1) 기존 리스트에서 같은 키워드 제거 (중복 방지)
        redisTemplate.opsForList().remove(key, 0, keyword);

        // 2) 맨 앞에 추가 (가장 최근 검색)
        redisTemplate.opsForList().leftPush(key, keyword);

        // 3) 최대 개수 유지
        redisTemplate.opsForList().trim(key, 0, MAX_RECENT_KEYWORDS - 1);

        // 4) TTL 설정 (예: 30일)
        redisTemplate.expire(key, Duration.ofDays(TTL_DAYS));
    }

    /**
     * 최근 검색어 조회
     */
    public List<String> getRecentKeywords(Long userId, int limit) {
        if (userId == null) return List.of();

        String key = getKey(userId);
        long endIndex = limit - 1L;

        List<String> result = redisTemplate.opsForList().range(key, 0, endIndex);
        return result != null ? result : List.of();
    }

    /**
     * 최근 검색어 전체 삭제
     */
    public void clear(Long userId) {
        if (userId == null) return;
        redisTemplate.delete(getKey(userId));
    }
}
