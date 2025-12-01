package com.together.workeezy.user;

import com.together.workeezy.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    // 로그인하면 스프링 시큐리티가 loadUserByUsername 자동 호출
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        // 이메일로 DB 검색
        return userRepository.findByEmail(email)
                .map(CustomUserDetails::new)
                // 없으면 로그인 실패
                .orElseThrow(() -> new UsernameNotFoundException("사용자 없음: " + email));
    }

}
