package com.together.workeezy.auth.controller;

import com.together.workeezy.auth.dto.*;
import com.together.workeezy.auth.jwt.JwtTokenProvider;
import com.together.workeezy.auth.security.CustomUserDetails;
import com.together.workeezy.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtProvider;
    private final AuthService authService; // 이메일/비밀번호 체크하는 service

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request){
        // 이메일/비번 받기
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // AuthenticationManager.authenticate() 실행(인증 시도)
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();


        // DB 비번과 raq 비번 자동 비교(BCrypt matches)

        // 성공하면 JwtTokenProvider로 토큰 생성
        String token = jwtProvider.createToken(
                userDetails.getUsername(),
                userDetails.getUser().getRole().name()
        );

        // 토큰을 응답으로 리턴
        return new LoginResponse(token);
    }
}
