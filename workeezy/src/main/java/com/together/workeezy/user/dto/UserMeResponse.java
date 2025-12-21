package com.together.workeezy.user.dto;

import com.together.workeezy.user.entity.User;

import java.time.LocalDate;

public record UserMeResponse(

        String email,
        String name,
        LocalDate birth,
        String phone,
        String company,
        String role

) {
    public static UserMeResponse from(User user) {
        return new UserMeResponse(
                user.getEmail(),
                user.getUserName(),
                user.getBirth(),
                user.getPhone(),
                user.getCompany(),
                user.getRole().name()
        );
    }
}