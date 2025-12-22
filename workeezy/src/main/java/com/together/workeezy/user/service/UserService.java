package com.together.workeezy.user.service;

import com.together.workeezy.common.exception.CustomException;
import com.together.workeezy.common.exception.ErrorCode;
import com.together.workeezy.user.dto.UserMeResponseDto;
import com.together.workeezy.user.dto.UserPasswordUpdateRequest;
import com.together.workeezy.user.entity.User;
import com.together.workeezy.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.together.workeezy.common.exception.ErrorCode.*;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void updatePhone(String email, String newPhone) {
        User user = getUser(email);
        user.changePhone(newPhone);
    }

    @Transactional
    public void updatePassword(String email, UserPasswordUpdateRequest request) {
        User user = getUser(email);

        // 현재 비밀번호 검증(서비스 책임)
        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new CustomException(PASSWORD_NOT_MATCH);
        }

        // 새 비밀번호 규칙 확인(DTO 책임)
        if (!request.newPassword().equals(request.newPasswordCheck())) {
            throw new CustomException(PASSWORD_CONFIRM_NOT_MATCH);
        }

        // 엔티티에 위임(도메인 책임)
        user.changePassword(request.newPassword(), passwordEncoder);
    }

    @Transactional(readOnly = true)
    public UserMeResponseDto getMyInfo(String email) {
        User user = getUser(email);

        return UserMeResponseDto.from(user);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
    }
}
