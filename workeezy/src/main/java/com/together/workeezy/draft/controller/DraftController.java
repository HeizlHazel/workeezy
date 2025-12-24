package com.together.workeezy.draft.controller;

import com.together.workeezy.auth.security.user.CustomUserDetails;
import com.together.workeezy.draft.domain.DraftId;
import com.together.workeezy.draft.service.DraftApplicationService;
//import com.together.workeezy.reservation.service.DraftRedisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/reservations/draft")
@RequiredArgsConstructor
public class DraftController {

    private final DraftApplicationService draftApplicationService;


    // 임시저장
    @PostMapping("/me")
    public ResponseEntity<?> saveDraft(
            @RequestBody Map<String, Object> draftData,
            Authentication authentication
    ) {
        Long userId = ((CustomUserDetails) authentication.getPrincipal()).getUserId();
        DraftId key = draftApplicationService.saveDraft(userId, draftData);

        return ResponseEntity.ok(Map.of(
                "message", "임시저장 완료",
                "id", key.value()
        ));
    }

    // 임시저장 리스트 불러오기
    @GetMapping("/me")
    public ResponseEntity<List<Map<String, Object>>> getDrafts(
            Authentication authentication
    ) {
        Long userId = ((CustomUserDetails) authentication.getPrincipal()).getUserId();
        return ResponseEntity.ok(draftApplicationService.getDraftList(userId));
    }

    // 특정 임시저장 불러오기
    // ✅ GET /{key} -> data(Map)만 내려줌 (프론트 normalizeDraftToForm(res.data) 유지)
    @GetMapping("/{key:.+}")
    public ResponseEntity<?> getDraftByKey(
            @PathVariable String key,
            Authentication authentication
    ) {
        Long userId = ((CustomUserDetails) authentication.getPrincipal()).getUserId();
        Map<String, Object> data = draftApplicationService.getDraftData(userId, key);
        return ResponseEntity.ok(data);
    }

    // 특정 임시저장 삭제하기
    @DeleteMapping("/{key:.+}")
    public ResponseEntity<?> deleteDraft(
            @PathVariable String key,
            Authentication authentication
    ) {
        Long userId = ((CustomUserDetails) authentication.getPrincipal()).getUserId();
        draftApplicationService.deleteDraft(userId, key);
        return ResponseEntity.ok(Map.of("message", "임시저장 삭제 완료"));
    }
    // (선택) 예외 응답을 지금처럼 유지하고 싶으면 간단 처리
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<?> handleAccessDenied(AccessDeniedException e) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", e.getMessage()));
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<?> handleNotFound(NoSuchElementException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
    }



}
