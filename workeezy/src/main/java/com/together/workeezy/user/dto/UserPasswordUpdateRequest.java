package com.together.workeezy.user.dto;

public record UserPasswordUpdateRequest(
        String currentPassword,
        String newPassword,
        String newPasswordCheck) {
}