package com.together.workeezy.user.dto;

import com.together.workeezy.user.entity.User;

import java.time.LocalDate;

public record UserMeResponseDto(

        String email,
        String name,
        LocalDate birth,
        String phone,
        String company,
        String role

) {
    public static UserMeResponseDto from(User user) {
        return new UserMeResponseDto(
                user.getEmail(),
                user.getUserName(),
                user.getBirth(),
                user.getPhone(),
                user.getCompany(),
                user.getRole().name()
        );
    }
}