package com.together.workeezy.program.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ReviewDto {
    private Long id;
    private String title;
    private String content;
    private Integer reviewPoint;
    private LocalDateTime reviewDate;
    private String userName;
}

