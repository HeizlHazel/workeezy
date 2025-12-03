package com.together.workeezy.auth.security;

import com.together.workeezy.user.entity.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

// 사용자 객체를 감싸는 클래스
@Getter
public class CustomUserDetails implements UserDetails {

    private final User user;

    public CustomUserDetails(User user) {
        this.user = user;
    }

    @Override
    public String getPassword() {
        return user.getPassword(); // BCrypt 해시 값
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    // role을 스프링 시큐리티가 이해하는 형태로 변환
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // 권한 반환
        return List.of(new SimpleGrantedAuthority("ROLE_USER" + user.getRole().name()));
    }

    @Override public boolean isAccountNonExpired() { return true; }

    @Override public boolean isAccountNonLocked() { return true; }

    @Override public boolean isCredentialsNonExpired() { return true; }

    @Override public boolean isEnabled() { return true; }
}
