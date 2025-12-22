package com.together.workeezy.user.dto;

import jakarta.validation.constraints.Pattern;

public record UserUpdateRequest(
        @Pattern(regexp = "^\\d{3}-\\d{4}-\\d{4}$") String phone) {
}
