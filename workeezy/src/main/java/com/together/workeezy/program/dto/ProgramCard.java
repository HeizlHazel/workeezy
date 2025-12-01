package com.together.workeezy.program.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProgramCard {
    private Long id;
    private String title;
    private String info;
    private Integer people;
    private Integer price;
    private String photo;   // placePhoto1
}
