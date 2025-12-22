package com.together.workeezy.auth.dto.internal;

public record LoginResult(
        String accessToken,
        String refreshToken,
        String name,
        String role,
        boolean autoLogin
) {
}