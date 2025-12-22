package com.together.workeezy.program.program.interfaces.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProgramCardDto {
    private Long id;       // program id
    private String title;  // program title
    private String photo;  // 대표 이미지 (place_photo1)
    private Integer price; // program_price
    private String region;


}
