package com.together.workeezy.search.interfaces.dto;

public record ProgramIndexRow(
        Long id,
        String title,
        String programInfo,
        Integer programPrice,
        String region,
        String photo
) {}