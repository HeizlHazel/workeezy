package com.together.workeezy.user.controller;

import com.together.workeezy.auth.security.user.CustomUserDetails;
import com.together.workeezy.common.dto.ApiResponse;
import com.together.workeezy.user.dto.UserMeResponseDto;
import com.together.workeezy.user.dto.UserPasswordUpdateRequest;
import com.together.workeezy.user.dto.UserUpdateRequest;
import com.together.workeezy.user.entity.User;
import com.together.workeezy.user.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 개인 정보 조회
    @GetMapping("/me")
    public ResponseEntity<UserMeResponseDto> getMyInfo(Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(userService.getMyInfo(email));
    }

    // 연락처 수정
    @PutMapping("/phone")
    public ResponseEntity<?> updatePhone(
            @Valid @RequestBody UserUpdateRequest request, Authentication authentication) {

        String email = authentication.getName();

        userService.updatePhone(email, request.phone());

        return ResponseEntity.ok(new ApiResponse("회원 정보 수정 완료"));
    }

    // 비밀번호 수정
    @PutMapping("/password")
    public ResponseEntity<?> updatePassword(
            @Valid @RequestBody UserPasswordUpdateRequest request, Authentication authentication) {

        String email = authentication.getName();

        userService.updatePassword(email, request);

        return ResponseEntity.ok(new ApiResponse("비밀번호 변경 완료"));
    }
}
