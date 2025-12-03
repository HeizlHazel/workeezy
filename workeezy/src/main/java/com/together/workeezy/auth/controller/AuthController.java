package com.together.workeezy.auth.controller;

import com.together.workeezy.auth.dto.*;
import com.together.workeezy.auth.jwt.JwtTokenProvider;
import com.together.workeezy.auth.redis.RedisService;
import com.together.workeezy.auth.security.CustomUserDetails;
import com.together.workeezy.auth.service.AuthService;
import io.jsonwebtoken.Claims;
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
    private final RedisService redisService;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request,
                               HttpServletResponse response) {

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

        // Access Token 생성
        String accessToken = jwtProvider.createToken(email, role);

        // Refresh Token 생성
        String refreshToken = jwtProvider.createToken(email, role);

        // Redis 저장(TTL = refresh-expiration-ms)
        redisService.savaRefreshToken(
                email,
                refreshToken,
                jwtProvider.getRefreshExpiration()
        );

        // Refresh Token -> HttpOnly 쿠키로 내려주기
        Cookie cookie = new Cookie("refreshToken", refreshToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // 로컬은 false, HTTPS는 true
        cookie.setPath("/");
        cookie.setMaxAge((int) (jwtProvider.getRefreshExpiration() / 1000));
        response.addCookie(cookie);

        // 프론트에는 accessToken만 응답
        return new LoginResponse(accessToken);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(HttpServletRequest request) {

        // 쿠키에서 refreshToken 꺼내기(
        String refreshToken = extractRefreshToken(request);
        if (refreshToken == null) {
            return ResponseEntity.status(401).body("Refresh token 없음");
        }

        // JWT 검증
        if (!jwtProvider.validateToken(refreshToken)) {
            return ResponseEntity.status(401).body("Refresh token 유효하지 않음");
        }

        // JWT 에서 email 꺼내기
        String email = jwtProvider.getEmailFromToken(refreshToken);

        // Redis에서 저장된 refreshToken 꺼내서 비교
        String savedToken = redisService.getRefreshToken(email);
        if (savedToken == null || !savedToken.equals(refreshToken)) {
            return ResponseEntity.status(401).body("Refresh token 일치하지 않음");
        }

        // 새로운 AccessToken 발급
        Claims claims = jwtProvider.getClaims(refreshToken);
        String role = claims.get("role", String.class);
        String newAccessToken = jwtProvider.createToken(email, role);

        return ResponseEntity.ok(new LoginResponse(newAccessToken));
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
