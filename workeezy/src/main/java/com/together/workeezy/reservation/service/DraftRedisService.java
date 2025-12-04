package com.together.workeezy.reservation.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class DraftRedisService {

    @Qualifier("draftRedisTemplate")
    private final RedisTemplate<String, Object> draftRedisTemplate;

    private static final String DRAFT_PREFIX = "draft:";

    // 임시저장 생성
    public void saveDraft(Long userId, Object draftData) {
        String key = DRAFT_PREFIX + userId + ":" + System.currentTimeMillis(); // draft:hong@naver.com:1733301234567
       draftRedisTemplate.opsForValue().set(key, draftData,14, TimeUnit.DAYS);

    }

    // 사용자별 임시저장 목록 조회
    public List<Object> getUserDrafts(Long userId) {
        // "draft:hong@naver.com:*" 으로 시작하는 모든 데이터를 찾기
        // Redis 안에서 특정 사용자에 해당하는 key 목록을 keys에 모아두고 key들을 하나씩 ㄷ로면서 .get(k)로 value를 하나씩 꺼냄.
        Set<String> keys = draftRedisTemplate.keys(DRAFT_PREFIX + userId+"*");
        if (keys == null) return Collections.emptyList();
        return keys.stream()
                // 각 k에 해당하는 value를 get
                .map(k -> draftRedisTemplate.opsForValue().get(k))
                .filter(Objects::nonNull)
                .toList();
    }

    // 특정 임시저장 삭제
    public void deleteDraft(String key) {
        draftRedisTemplate.delete(key); // Redis 내부적으로 DEL key
    }
}
