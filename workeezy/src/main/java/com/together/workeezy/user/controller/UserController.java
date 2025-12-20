package com.together.workeezy.user.controller;

import com.together.workeezy.auth.security.user.CustomUserDetails;
import com.together.workeezy.user.dto.UserMeResponse;
import com.together.workeezy.user.dto.UserPasswordUpdateRequest;
import com.together.workeezy.user.dto.UserUpdateRequest;
import com.together.workeezy.user.entity.User;
import com.together.workeezy.user.service.UserService;
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
    public ResponseEntity<UserMeResponse> getMyInfo(Authentication authentication) {

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        User user = userDetails.getUser();

        UserMeResponse response = new UserMeResponse(
                user.getEmail(),
                user.getUserName(),
                user.getBirth(),
                user.getPhone(),
                user.getCompany(),
                user.getRole().name()
        );
        return ResponseEntity.ok(response);
    }

    // 연락처 수정
    @PutMapping("/phone")
    public ResponseEntity<?> updatePhone(
            @RequestBody UserUpdateRequest request, Authentication authentication) {

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        String email = userDetails.getUsername();

        userService.updatePhone(email, request.phone());

        return ResponseEntity.ok("회원 정보 수정 완료");
    }

    @Pattern(regexp = "^\\d{3}-\\d{4}-\\d{4}$",
            message = "연락처는 010-1234-5678 형식(하이픈 포함 13자리)으로 입력해주세요.")
    private String phone;

    @PutMapping("/password")
    public ResponseEntity<?> updatePassword(
            @RequestBody UserPasswordUpdateRequest request, Authentication authentication) {

        String email = authentication.getName();

        System.out.println(request);

        userService.updatePassword(email, request);


        return ResponseEntity.ok("비밀번호 변경 완료");
    }
}
