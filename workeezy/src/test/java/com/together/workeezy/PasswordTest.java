package com.together.workeezy;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

class PasswordTest {

    // 비밀번호 암호화
    @Test
    void encodeTest() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        System.out.println(encoder.encode("900515"));
    }
}