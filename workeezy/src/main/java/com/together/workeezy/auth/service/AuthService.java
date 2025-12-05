package com.together.workeezy.auth.service;

import com.together.workeezy.auth.jwt.JwtTokenProvider;
import com.together.workeezy.auth.redis.RedisService;
import com.together.workeezy.user.entity.User;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtTokenProvider jwtTokenProvider;
    private final RedisService redisService;
    private final PasswordEncoder passwordEncoder;

    // 로그인 성공 시 RefreshToken 저장
    public void saveRefreshToken(String email, String refreshToken) {
        redisService.saveRefreshToken(
                email,
                refreshToken,
                jwtTokenProvider.getRefreshExpiration()
        );
    }

    // RefreshToken으로 AccessToken 재발급
    public String reissueAccessToken(String refreshToken) {

        // 토큰 만료 여부 확인
        if(!jwtTokenProvider.validateToken(refreshToken)) {
            throw new RuntimeException("Refresh token 만료 또는 위조");
        }

        // refreshToken에서 이메일 추출
        String email = jwtTokenProvider.getEmailFromToken(refreshToken);

        // Redis에 저장된 refreshToken 가져오기
        String savedToken = redisService.getRefreshToken(email);

        if(savedToken == null) {
            throw new RuntimeException("서버에 Refresh Token 없음(로그아웃된 사용자)");
        }

        if(!savedToken.equals(refreshToken)) {
            throw new RuntimeException("Refresh Token 불일치(탈취/중복 로그인 가능)");
        }

        // role 꺼내기
        Claims claims = jwtTokenProvider.getClaims(refreshToken);
        String role = (String) claims.get("role");

        // 새 Access Token 발급
        return jwtTokenProvider.createAccessToken(email, role);

    }

    // 로그아웃
    public void logout(String refreshToken) {

        // refreshToken에서 이메일 추출
        String email = jwtTokenProvider.getEmailFromToken(refreshToken);

        // Redis에서 refreshToken 삭제
        redisService.deleteRefreshToken(email);
    }

    // 비밀번호 검증
    public boolean checkPassword(User user, String rawPassword) {
        if(rawPassword == null) return false; // 보호 코드
        return passwordEncoder.matches(rawPassword, user.getPassword());
    }
}
