package com.together.workeezy.user;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserRepository repository;

    @GetMapping("/db/test")
    public String testDb() {
        UserTest user = new UserTest();
        user.setName("testuser");
        repository.save(user);

        long count = repository.count();
        return "DB 연결 성공! 현재 UserTest 행 개수: " + count;
    }
}