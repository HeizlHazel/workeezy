package com.together.workeezy.user.service;

import com.together.workeezy.user.dto.UserPasswordUpdateRequest;
import com.together.workeezy.user.entity.User;
import com.together.workeezy.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void updatePhone(String email, String newPhone) {
        User user = getUser(email);

        user.setPhone(newPhone);
    }

    @Transactional
    public void updatePassword(String email, UserPasswordUpdateRequest request) {
        User user = getUser(email);

        // 현재 비밀번호 검증
        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
        }

        // 새 비밀번호 규칙 확인
        if (!request.newPassword().equals(request.newPasswordCheck())) {
            throw new IllegalArgumentException("새 비밀번호가 서로 일치하지 않습니다.");
        }

        validatePasswordRule(request.newPasswordCheck());

        // 암호화하여 저장
        user.setPassword(passwordEncoder.encode(request.newPassword()));
    }

    private void validatePasswordRule(String password) {
        if (password.length() < 8 || password.length() > 16) {
            throw new IllegalArgumentException("비밀번호는 8~16자여야 합니다.");
        }

        if (!password.matches(".*[0-9].*")) {
            throw new IllegalArgumentException("비밀번호에는 숫자가 1개 이상 포함되어야 합니다.");
        }

        if (!password.matches(".*[A-Z].*")) {
            throw new IllegalArgumentException("비밀번호에는 영어 대문자가 1개 이상 포함되어야 합니다.");
        }

        if (!password.matches(".*[a-z].*")) {
            throw new IllegalArgumentException("비밀번호에는 영어 소문자가 1개 이상 포함되어야 합니다.");
        }

        if (!password.matches(".*[!@#$%^&*(),.?\":{}|<>].*")) {
            throw new IllegalArgumentException("비밀번호에는 특수문자가 1개 이상 포함되어야 합니다.");
        }
    }

    private User getUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자 없음"));
        return user;
    }
}
