package com.together.workeezy.auth.controller;

import com.together.workeezy.auth.dto.*;
import com.together.workeezy.auth.jwt.JwtTokenProvider;
import com.together.workeezy.auth.security.CustomUserDetails;
import com.together.workeezy.auth.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtProvider;
    private final AuthService authService;

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

        // Access Token 생성
        String accessToken = jwtProvider.createAccessToken(email, role);

        // Refresh Token 생성
        String refreshToken = jwtProvider.createRefreshToken(email, role);

        // Redis에 refreshToken 저장 (AuthService)
        authService.saveRefreshToken(email, refreshToken);

        // Refresh Token -> HttpOnly 쿠키로 내려주기
        Cookie cookie = new Cookie("refreshToken", refreshToken);
        cookie.setHttpOnly(true);

        cookie.setMaxAge((int) (jwtProvider.getRefreshExpiration() / 1000));
        cookie.setPath("/");
        response.addCookie(cookie);
        System.out.println("✅ 인증 성공: " + authentication.getName());

        return new LoginResponse(accessToken, name);

    }

    // 새 Access Token 재발급
    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refresh(HttpServletRequest request) {

        // 쿠키에서 refreshToken 꺼내기(
        String refreshToken = extractRefreshToken(request);
        if (refreshToken == null) {
            return ResponseEntity.status(401).build();
        }

        // 서비스에서 실제 재발급 로직 수행
        String newAccessToken = authService.reissueAccessToken(refreshToken);

        return ResponseEntity.ok(new LoginResponse(newAccessToken, null));
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
}
