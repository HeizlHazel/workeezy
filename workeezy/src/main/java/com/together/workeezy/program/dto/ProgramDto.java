package com.together.workeezy.program.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProgramDto {

    private Long id;
    private String title;
    private String programInfo;
    private String programPeople;
    private Long stayId;
    private Long officeId;
    private Long attractionId1;
    private Long attractionId2;
    private Long attractionId3;



}
