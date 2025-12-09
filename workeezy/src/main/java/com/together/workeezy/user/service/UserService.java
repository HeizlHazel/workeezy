package com.together.workeezy.user.service;

import com.together.workeezy.user.entity.User;
import com.together.workeezy.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional
    public void updatePhone(String email, String newPhone) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자 없음"));

        user.setPhone(newPhone);
    }
}
