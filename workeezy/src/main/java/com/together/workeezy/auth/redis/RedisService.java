package com.together.workeezy.auth.redis;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RedisService {

    private final RedisTemplate<String, String> redisTemplate;

    private static final String REFRESH_PREFIX = "refresh:";

    // RefreshToken 저장(로그인 시 저장)
    public void savaRefreshToken(String email, String refreshToken, long ttlMs) {
        redisTemplate
                .opsForValue()
                .set(
                        REFRESH_PREFIX + email, // key = refresh:userEmail
                        refreshToken,               // value = JWT
                        ttlMs,                      // TTL
                        TimeUnit.MILLISECONDS       // 단위 = ms
                );
    }

    // RefreshToken 조회(재발급 시 사용)
    public String getRefreshToken(String email) {
        return redisTemplate
                .opsForValue()
                .get(REFRESH_PREFIX + email);
    }

    // RefreshToken 삭제(로그아웃 시)
    public void deleteRefreshToken(String email) {
        redisTemplate.delete(REFRESH_PREFIX + email);
    }
}
