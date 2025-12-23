package com.together.workeezy.auth.controller;

import com.together.workeezy.auth.dto.internal.LoginResult;
import com.together.workeezy.auth.dto.request.LoginRequest;
import com.together.workeezy.auth.dto.response.LoginResponse;
import com.together.workeezy.auth.security.user.CustomUserDetails;
import com.together.workeezy.auth.service.AuthService;
import com.together.workeezy.auth.service.CookieService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final CookieService cookieService;

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request,
            HttpServletResponse response) {

        LoginResult result = authService.login(
                request.getEmail(),
                request.getPassword(),
                request.isAutoLogin()
        );
        cookieService.addRefreshCookie(response, result.refreshToken(), result.autoLogin());

        return ResponseEntity.ok(
                new LoginResponse(result.accessToken(), result.name(), result.role()));
    }

    // AccessToken 재발급
    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refresh(HttpServletRequest request) {

        String refreshToken = cookieService.extractRefreshToken(request);

        LoginResponse response = authService.refresh(refreshToken);

        return ResponseEntity.ok(response);
    }

    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            HttpServletRequest request,
            HttpServletResponse response) {

        String refreshToken = cookieService.extractRefreshToken(request);

        authService.logout(refreshToken);

        cookieService.deleteRefreshCookie(response);

        return ResponseEntity.ok("로그아웃 성공");
    }

    // 마이페이지 접근 시 비밀번호 검증
    @PostMapping("/check-password")
    public ResponseEntity<?> checkPassword(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody Map<String, String> request) {

        boolean result = authService.checkPassword(userDetails.getUser(), request.get("password"));

        return ResponseEntity.ok(Map.of("success", result));
    }
}