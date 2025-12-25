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
import org.springframework.http.HttpStatus;
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

    // 환경 분기 (로컬)
    private static final boolean IS_PROD = false;

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

        // accessToken을 쿠키로 내려줌
        // 실제 API 인증에 사용됨
        // 이후 모든 요청에서 이 쿠키가 자동 전송
        cookieService.addAccessCookie(
                response,
                result.accessToken(),
                IS_PROD
        );

        // refreshToken을 쿠키로 내려줌
        // accessToken 만료 시 재발급용
        // HttpOnly 쿠키 + Redis 저장과 함께 사용
        cookieService.addRefreshCookie(
                response,
                result.refreshToken(),
                result.autoLogin(),
                IS_PROD
        );

        // 프론트에 로그인 성공 응답 전달
        return ResponseEntity.ok(
                new LoginResponse(
                        result.accessToken(),
                        result.name(),
                        result.role()
                )
        );
    }

    // AccessToken 재발급
    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refresh(
            HttpServletRequest request,
            HttpServletResponse response) {

        // 요청에 포함된 refreshToken 쿠키 추출
        String refreshToken = cookieService.extractRefreshToken(request);

        if (refreshToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // refreshToken 검증 + Redis 대조 + 새 accessToken 생성
        LoginResult result = authService.refresh(refreshToken);

        // 새로 발급한 accessToken을 쿠키로 다시 내려줌
        // 기존 accessToken 폐기
        // 이후 요청부터는 이 new 토큰 사용됨
        cookieService.addAccessCookie(
                response,
                result.accessToken(),
                IS_PROD

        );
        System.out.println("🔥 refresh accessToken 발급");

        // 프론트 응답
        return ResponseEntity.ok(
                new LoginResponse(
                        result.accessToken(),
                        result.name(),
                        result.role()
                )
        );
    }

    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            HttpServletRequest request,
            HttpServletResponse response) {

        String refreshToken = cookieService.extractRefreshToken(request);

        authService.logout(refreshToken);

        // access / refresh 쿠키 모두 삭제
        cookieService.deleteAccessCookie(response, IS_PROD);
        cookieService.deleteRefreshCookie(response, IS_PROD);

        return ResponseEntity.ok("로그아웃 성공");
    }

    // 마이페이지 접근 시 비밀번호 검증
    @PostMapping("/check-password")
    public ResponseEntity<?> checkPassword(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody Map<String, String> request) {

        boolean result = authService.checkPassword(
                userDetails.getUser(),
                request.get("password")
        );

        return ResponseEntity.ok(Map.of("success", result));
    }
}