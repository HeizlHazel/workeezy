package com.together.workeezy.reservation.controller;

import com.together.workeezy.auth.jwt.JwtTokenProvider;
import com.together.workeezy.auth.jwt.JwtTokenProviderForUserId;
import com.together.workeezy.reservation.service.DraftRedisService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations/draft") // 기본 url
@RequiredArgsConstructor
public class DraftController {

    private final DraftRedisService draftRedisService;
    private final JwtTokenProviderForUserId  JwtTokenProviderForUserId;

    // 임시저장 생성
    @PostMapping("/me")
    public ResponseEntity<?> saveDraft(
            @RequestBody Map<String, Object> draftData,
            @RequestHeader("Authorization") String token
    ) {
        Long userId = JwtTokenProviderForUserId.getUserIdFromToken(token.substring(7)); // Bearer 제거
        String key = draftRedisService.saveDraft(userId,draftData);
        return ResponseEntity.ok(Map.of(
                "message", "임시저장 완료",
                "id", key // 프론트로 key 전달
        ));
    }

    // 임시저장 목록 조회 (GET /api/reservations/draft/me)
    @GetMapping("/me")
    public ResponseEntity<List<Map<String, Object>>> getDrafts(
            @RequestHeader("Authorization") String token
    ) {
        // 토큰의 userId로 사용자가 누구인지
        Long userId = JwtTokenProviderForUserId.getUserIdFromToken(token.substring(7));
        List<Map<String, Object>> drafts = draftRedisService.getUserDrafts(userId);
        return ResponseEntity.ok(drafts);
    }

    @DeleteMapping("/{key}")
    public ResponseEntity<?> deleteDraft(
            @PathVariable String key,
            @RequestHeader("Authorization") String token
    ){
        // 토큰 이메일 검증은 나중에 보안강화시 추가
        draftRedisService.deleteDraft(key);
        return ResponseEntity.ok(Map.of("message", "임시저장 삭제 완료"));
    }

// CORS 허용도 되어 있고, Authorization 헤더 기반 인증 구조도 완벽.


}
