package com.together.workeezy.program.program.interfaces.dto;

public record ProgramCardDto(
        Long id,       // program id
        String title,  // program title
        String photo,  // 대표 이미지 (place_photo1)
        Integer price, // program_price
        String region
) {}
