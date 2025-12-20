package com.together.workeezy.auth.controller;

import com.together.workeezy.auth.dto.request.LoginRequest;
import com.together.workeezy.auth.dto.response.LoginResponse;
import com.together.workeezy.auth.security.jwt.JwtTokenProvider;
import com.together.workeezy.auth.service.TokenRedisService;
import com.together.workeezy.auth.security.user.CustomUserDetails;
import com.together.workeezy.auth.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtProvider;
    private final AuthService authService;
    private final TokenRedisService tokenRedisService;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request,
                               HttpServletResponse response) {

        System.out.println("🔐 로그인 시도: " + request.getEmail());
        // 이메일/비밀번호 받기
        // AuthenticationManager 로 로그인 실행
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // 성공 시 CustomUserDetails 로 유저 정보 가져오기
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        String email = userDetails.getUsername();
        String role = userDetails.getUser().getRole().name();
        String name = userDetails.getUser().getUserName();
        Long userId = userDetails.getUser().getId();

        // Access Token 생성
        String accessToken = jwtProvider.createAccessToken(email, role, userId);
        // Refresh Token 생성
        String refreshToken = jwtProvider.createRefreshToken(email, role, userId);

        // Redis에 refreshToken 저장 (AuthService)
        authService.saveRefreshToken(email, refreshToken);

        // autoLogin 값 꺼내기
        boolean autoLogin = request.isAutoLogin();

        // Refresh Token -> HttpOnly 쿠키로 내려주기
        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(true)       // https 필수
                .sameSite("None")   // 크로스 도메인 필수
                .path("/")
                .domain(".workeezy.cloud")
                .maxAge(autoLogin ? jwtProvider.getRefreshExpiration() / 1000 : -1)
                .build();

        // ResponseCookie는 반드시 헤더로만 내려야 함
        response.setHeader("Set-Cookie", cookie.toString());
        System.out.println("🍪 Set-Cookie = " + cookie);

        System.out.println("✅ 인증 성공: " + authentication.getName());

        return new LoginResponse(accessToken, name, role);
    }

    // 새 Access Token 재발급
    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refresh(HttpServletRequest request) {

        // 쿠키에서 refreshToken 꺼내기(
        String refreshToken = extractRefreshToken(request);
        if (refreshToken == null) {
            return ResponseEntity.status(401).build();
        }

        String email = jwtProvider.getEmailFromToken(refreshToken);
        String role = jwtProvider.getRoleFromToken(refreshToken);

        // 서비스에서 실제 재발급 로직 수행
        String newAccessToken = authService.reissueAccessToken(refreshToken);

        return ResponseEntity.ok(new LoginResponse(newAccessToken, null, role));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {

        deleteRefreshCookie(response);

        // 헤더에서 AccessToken 꺼내기
        String accessToken = resolveAccessToken(request);
        System.out.println("로그아웃 accessToken = " + accessToken);

        if (accessToken != null && jwtProvider.validateToken(accessToken)) {

            long ttl = jwtProvider.getRemainingExpiration(accessToken);

            System.out.println("로그아웃 accessToken = " + accessToken);
            System.out.println("TTL 남은 시간(ms) = " + ttl);

            // 남은 ttl만큼 블랙리스트에 저장
            tokenRedisService.blacklistAccessToken(accessToken, ttl);
            System.out.println("블랙리스트 저장 시도 완료");
        }

        // refreshToken 삭제
        String refreshToken = extractRefreshToken(request);
        if (refreshToken != null) {
            String email = jwtProvider.getEmailFromToken(refreshToken);
            tokenRedisService.deleteRefreshToken(email);
        }

        return ResponseEntity.ok("로그아웃 성공");
    }

    // 마이페이지 접근 시 비밀번호 검증
    @PostMapping("/check-password")
    public ResponseEntity<?> checkPassword(@AuthenticationPrincipal CustomUserDetails userDetails,
                                           @RequestBody Map<String, String> request) {

        String rawPassword = request.get("password");

        if (rawPassword == null || rawPassword.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "password required"
            ));
        }

        if (userDetails == null) {
            return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "message", "unauthorized: token missing or invalid"
            ));
        }

        boolean result = authService.checkPassword(userDetails.getUser(), rawPassword);

        return ResponseEntity.ok(Map.of("success", result));
    }

    // 쿠키 꺼내는 메서드
    private String extractRefreshToken(HttpServletRequest request) {
        if (request.getCookies() == null) return null;

        for (Cookie cookie : request.getCookies()) {
            if (cookie.getName().equals("refreshToken")) {
                return cookie.getValue();
            }
        }
        return null;
    }

    // 쿠키 삭제 메서드
    private void deleteRefreshCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie("refreshToken", null);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setDomain("localhost");
        cookie.setMaxAge(0); // 즉시 삭제
        response.addCookie(cookie);
    }

    // Authorization 헤더에서 Bearer 토큰 추출
    private String resolveAccessToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }

}
