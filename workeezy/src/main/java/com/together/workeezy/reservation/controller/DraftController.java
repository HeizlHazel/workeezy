package com.together.workeezy.reservation.controller;

import com.together.workeezy.auth.security.jwt.JwtTokenProvider;
import com.together.workeezy.reservation.service.DraftRedisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations/draft") // 기본 url
@RequiredArgsConstructor
public class DraftController {

    private final DraftRedisService draftRedisService;
    private final JwtTokenProvider jwtTokenProvider;

    // 임시저장 생성
    @PostMapping("/me")
    public ResponseEntity<?> saveDraft(
            @RequestBody Map<String, Object> draftData,
            @RequestHeader("Authorization") String token
    ) {
        Long userId = jwtTokenProvider.getUserIdFromToken(token.substring(7)); // Bearer 제거
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
        Long userId = jwtTokenProvider.getUserIdFromToken(token.substring(7));
        List<Map<String, Object>> drafts = draftRedisService.getUserDrafts(userId);
        return ResponseEntity.ok(drafts);
    }

    // 특정 임시저장 불러오기
    @GetMapping("/{key:.+}")
    public ResponseEntity<?> getDraftByKey(
            @PathVariable String key,
            @RequestHeader("Authorization") String token
    ){
        Long userId = jwtTokenProvider.getUserIdFromToken(token.substring(7));


        // 본인 확인
        if (!key.startsWith("draft:"+userId)){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error","본인 데이터만 조회할 수 있습니다."));
        }
        // Redis에서 데이터 꺼내오기
        Object draft =draftRedisService.getDraftByKey(key);
        if (draft == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error","임시저장을 찾을 수 없습니다."));
        }
        return ResponseEntity.ok(draft);
    }

    @DeleteMapping("/{key}")
    public ResponseEntity<?> deleteDraft(
            @PathVariable String key,
            @RequestHeader("Authorization") String token
    ){
        Long userId = jwtTokenProvider.getUserIdFromToken(token.substring(7));
        if(!key.startsWith("draft:"+userId)){
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error","본인 데이터만 삭제할 수 있습니다."));
        }

        draftRedisService.deleteDraft(key);
        return ResponseEntity.ok(Map.of("message", "임시저장 삭제 완료"));
    }



}
