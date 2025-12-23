package com.together.workeezy.auth.security.filter;

import com.together.workeezy.auth.security.jwt.JwtTokenProvider;
import com.together.workeezy.auth.service.TokenRedisService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final TokenRedisService tokenRedisService;
    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    // 토큰 검증 제외할 URL (화이트리스트)
    private static final List<String> WHITELIST = List.of(
            "/api/auth/login",
            "/api/auth/refresh",
            "/api/programs/**",
            "/api/reviews",
            "/api/reviews/**",
            "/ping",              // debug
            "/error"
    );

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            System.out.println("🟢 OPTIONS 요청 통과");
            filterChain.doFilter(request, response);
            return;
        }

        String requestURI = request.getRequestURI();
        System.out.println("📌 JwtFilter 요청 경로: " + requestURI);

        // OPTIONS 요청은 항상 허용 (CORS Preflight)
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        // 화이트리스트 URL은 JWT 인증 스킵
        for (String pattern : WHITELIST) {
            if (pathMatcher.match(pattern, requestURI)) {
                System.out.println("➡️ 인증 스킵 (화이트리스트): " + pattern);
                filterChain.doFilter(request, response);
                return;
            }
        }
        System.out.println("========== JWT FILTER START ==========");
        System.out.println("📌 URI = " + request.getRequestURI());
        String token = resolveToken(request);

        System.out.println("🧩 token 존재 = " + (token != null));

        if (token != null) {
            System.out.println("🧩 token 앞 10글자 = " + token.substring(0, Math.min(10, token.length())));
            // 블랙리스트 체크
            if (tokenRedisService.isBlacklisted(token)) {
                System.out.println("🚫 블랙리스트 토큰 → 인증 차단");
                // 바로 인증 세팅하지 않고 통과만(익명 사용자로 처리)
                filterChain.doFilter(request, response);
                return;
            }

            // 유효하면 정상 인증
            if (jwtTokenProvider.validateToken(token)) {

                // Authentication 생성
                Authentication auth = jwtTokenProvider.getAuthentication(token);

                if (auth != null) {
                    SecurityContextHolder.getContext().setAuthentication(auth);
                    System.out.println("🔥 JWT 인증 성공: " + auth.getName());
                    System.out.println("🔥 authorities = " + auth.getAuthorities());
                } else {
                    SecurityContextHolder.clearContext();
                    System.out.println("❌ getAuthentication()이 null 반환");
                }

                System.out.println("🔥 auth 객체 = " + auth);
                System.out.println("🔥 auth name = " + auth.getName());
                System.out.println("🔥 auth authorities = " + auth.getAuthorities());

                SecurityContextHolder.getContext().setAuthentication(auth);

                System.out.println("🔥 JWT 인증 성공: " + auth.getName());
                System.out.println("✅ SecurityContext 인증 세팅 완료");
            } else {
                System.out.println("❌ JWT 인증 실패 또는 없음");
            }
        } else {
            SecurityContextHolder.clearContext();
            System.out.println("❌ JWT 토큰 없음");
            System.out.println("========== JWT FILTER END ==========");
        }
        filterChain.doFilter(request, response);

        Authentication ctxAuth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("🧠 FILTER END Context auth = " + ctxAuth);
    }

    // Authorization 헤더 + HttpOnly 쿠키
    private String resolveToken(HttpServletRequest request) {

        // Authorization 헤더에서 bearer 토큰
        String header = request.getHeader("Authorization");
        System.out.println("🪶 Authorization 헤더 내용: " + header);

        if (header != null && header.startsWith("Bearer ")) {
            String bearerToken = header.substring(7);
            if (!"undefined".equals(bearerToken) && !bearerToken.isBlank()) {
                return bearerToken;
            }
        }

        // HttpOnly 쿠키에서 accessToken
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("accessToken".equals(cookie.getName())) {
                    System.out.println("🍪 accessToken 쿠키 발견");
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}