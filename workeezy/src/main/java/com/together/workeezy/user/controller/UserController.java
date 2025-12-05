package com.together.workeezy.user.controller;

import com.together.workeezy.auth.security.CustomUserDetails;
import com.together.workeezy.user.dto.UserMeResponse;
import com.together.workeezy.user.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/user")
public class UserController {

    @GetMapping("/me")
    public ResponseEntity<UserMeResponse> getMyInfo(Authentication authentication){

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        User user = userDetails.getUser();

        UserMeResponse response = new UserMeResponse(
                user.getEmail(),
                user.getUserName(),
                user.getRole().name()
        );
        return ResponseEntity.ok(response);
    }
}
