package com.together.workeezy.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class TokenRedisService {

    private final RedisTemplate<String, String> loginRedisTemplate;

    private static final String REFRESH_PREFIX = "refresh:";
    private static final String BLACKLIST_PREFIX = "blacklist:";

    // RefreshToken 저장(로그인 시 저장)
    public void saveRefreshToken(String email, String refreshToken, long ttlMs) {
        loginRedisTemplate                .opsForValue()
                .set(
                        REFRESH_PREFIX + email, // key = refresh:userEmail
                        refreshToken,               // value = JWT
                        ttlMs,                      // TTL
                        TimeUnit.MILLISECONDS       // 단위 = ms
                );
    }

    // RefreshToken 조회(재발급 시 사용)
    public String getRefreshToken(String email) {
        return loginRedisTemplate                .opsForValue()
                .get(REFRESH_PREFIX + email);
    }

    // RefreshToken 삭제(로그아웃 시)
    public void deleteRefreshToken(String email) {
        loginRedisTemplate.delete(REFRESH_PREFIX + email);
    }

    // AccessToken 블랙리스트 저장 (로그아웃 시)
    public void blacklistAccessToken(String accessToken, long ttlMs) {
        if (ttlMs <= 0) return; // 이미 만료된 토큰이면 저장 의미 없음

        loginRedisTemplate                .opsForValue()
                .set(
                        BLACKLIST_PREFIX + accessToken,
                        "logout",
                        ttlMs,
                        TimeUnit.MILLISECONDS
                );
    }

    // 블랙리스트 여부 조회(필터에서 사용)
    public boolean isBlacklisted(String accessToken) {
        String value = loginRedisTemplate                .opsForValue()
                .get(BLACKLIST_PREFIX + accessToken);
        return value != null;
    }
}
