package com.together.workeezy.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class UserMeResponseDto {

    private String email;
    private String name;
    private LocalDate birth;
    private String phone;
    private String company;
    private String role;

}
