package com.together.workeezy.auth.service;

import com.together.workeezy.auth.security.jwt.JwtTokenProvider;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CookieService {

    private final JwtTokenProvider jwtTokenProvider;

    // refresh 쿠키 만들기
    public void addRefreshCookie(
            HttpServletResponse response,
            String refreshToken,
            boolean autoLogin
    ) {

        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .domain("api.workeezy.cloud")
                .maxAge(autoLogin ? jwtTokenProvider.getRefreshExpiration() / 1000 : -1)
                .build();

        response.addHeader("Set-Cookie", cookie.toString());
    }

    // logout 시 쿠키 삭제
    public void deleteRefreshCookie(HttpServletResponse response) {

        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .domain("api.workeezy.cloud")
                .build();

        response.addHeader("Set-Cookie", cookie.toString());
    }

    // request -> refresh 쿠키 추출
    public String extractRefreshToken(HttpServletRequest request) {

        if (request.getCookies() == null) return null;

        for (Cookie cookie : request.getCookies()) {
            if (cookie.getName().equals("refreshToken")) {
                return cookie.getValue();
            }
        }
        return null;
    }
}