package com.together.workeezy.auth.security.jwt;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException
    ) throws IOException {
        log.error("🚨 [EntryPoint] 401 UNAUTHORIZED triggered - {}", authException.getMessage());

        // 인증 안 됐으면 무조건 401
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
    }
}