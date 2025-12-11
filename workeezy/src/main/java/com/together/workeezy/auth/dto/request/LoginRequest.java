package com.together.workeezy.auth.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class LoginRequest {

    private String email;
    private String password;
    private boolean autoLogin; // 자동 로그인 여부
    
}
