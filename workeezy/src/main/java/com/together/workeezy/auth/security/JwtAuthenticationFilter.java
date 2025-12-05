package com.together.workeezy.auth.security;

import com.together.workeezy.auth.jwt.JwtTokenProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    // 토큰 검증 제외할 URL (화이트리스트)
    private static final List<String> WHITELIST = List.of(
            "/api/auth/login",
            "/api/auth/refresh",
            "/api/programs/**",
            "/api/search/**"
    );

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

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

        String token = resolveToken(request);

        if (token != null && jwtTokenProvider.validateToken(token)) {
            // Authentication 생성
            Authentication auth = jwtTokenProvider.getAuthentication(token);
            SecurityContextHolder.getContext().setAuthentication(auth);

            System.out.println("🔥 JWT 인증 성공: " + auth.getName());
        } else {
            System.out.println("❌ JWT 인증 실패 또는 없음");
        }
        System.out.println("인증 성공 여부 = " +
                SecurityContextHolder.getContext().getAuthentication());

        filterChain.doFilter(request, response);
    }


    // Authorization 헤더에서 Bearer 토큰 추출
    private String resolveToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        System.out.println("🪶 Authorization 헤더 내용: " + header);
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;

    }

}