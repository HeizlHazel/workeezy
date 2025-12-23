package com.together.workeezy;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootTest
class WorkeezyApplicationTests {

    @Autowired
    PasswordEncoder passwordEncoder;

//    @Test
//    void encodeTest() {
//        System.out.println(passwordEncoder.encode("1234"));
//    }

}
