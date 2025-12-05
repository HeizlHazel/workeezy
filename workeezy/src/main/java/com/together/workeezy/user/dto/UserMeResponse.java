package com.together.workeezy.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserMeResponse {

    private String email;
    private String name;
    private String role;

}
