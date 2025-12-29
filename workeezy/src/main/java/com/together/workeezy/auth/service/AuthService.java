package com.together.workeezy.auth.service;

import com.together.workeezy.auth.dto.internal.LoginResult;
import com.together.workeezy.auth.security.jwt.JwtTokenProvider;
import com.together.workeezy.auth.security.user.CustomUserDetails;
import com.together.workeezy.common.exception.CustomException;
import com.together.workeezy.user.entity.User;
import com.together.workeezy.user.repository.UserRepository;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import static com.together.workeezy.common.exception.ErrorCode.*;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final TokenRedisService tokenRedisService;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    // 로그인 처리
    public LoginResult login(String email, String password, boolean autoLogin) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );

        CustomUserDetails user = (CustomUserDetails) authentication.getPrincipal();

        String access = jwtTokenProvider.createAccessToken(
                email,
                user.getUser().getRole().name(),
                user.getUser().getId()
        );

        String refresh = jwtTokenProvider.createRefreshToken(
                email,
                user.getUser().getRole().name(),
                user.getUser().getId()
        );

        tokenRedisService.saveRefreshToken(
                email,
                refresh,
                jwtTokenProvider.getRefreshExpiration()
        );

        return new LoginResult(
                access,
                refresh,
                user.getUser().getUserName(),
                user.getUser().getRole().name(),
                autoLogin
        );
    }

    // RefreshToken으로 AccessToken 재발급
    public LoginResult refresh(String refreshToken) {

        if (refreshToken == null) {
            throw new CustomException(AUTH_REFRESH_TOKEN_NOT_FOUND);
        }

        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new CustomException(AUTH_REFRESH_TOKEN_EXPIRED);
        }

        String email = jwtTokenProvider.getEmailFromToken(refreshToken);

        String savedToken = tokenRedisService.getRefreshToken(email);
        if (savedToken == null) {
            throw new CustomException(AUTH_REFRESH_TOKEN_NOT_SAVED);
        }

        if (!savedToken.equals(refreshToken)) {
            throw new CustomException(AUTH_REFRESH_TOKEN_MISMATCH);
        }

        Claims claims = jwtTokenProvider.getClaims(refreshToken);
        String role = (String) claims.get("role");
        if (role.startsWith("ROLE_")) {
            role = role.substring(5); // ROLE_ADMIN → ADMIN
        }
        Long userId = claims.get("userId", Long.class);

        String newAccess = jwtTokenProvider.createAccessToken(email, role, userId);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(USER_NOT_FOUND));

        // 새 Access Token 발급
        // 내부 로직용 객체 반환
        return new LoginResult(
                newAccess,
                null,    // refreshToken (refresh에서는 새로 안 만듦)
                user.getUserName(),
                role,
                false               // autoLogin (refresh에서는 의미 없음)
        );
    }

    // 로그아웃
    public void logout(String refreshToken) {

        if (refreshToken == null) return;

        if (!jwtTokenProvider.validateToken(refreshToken)) return;

        // refreshToken에서 이메일 추출
        String email = jwtTokenProvider.getEmailFromToken(refreshToken);

        // Redis에서 refreshToken 삭제
        tokenRedisService.deleteRefreshToken(email);
    }

    // 비밀번호 검증
    public boolean checkPassword(User user, String rawPassword) {

        if (rawPassword == null) return false; // 보호 코드

        return passwordEncoder.matches(rawPassword, user.getPassword());
    }
}