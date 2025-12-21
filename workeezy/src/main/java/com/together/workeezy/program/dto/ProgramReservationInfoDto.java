package com.together.workeezy.program.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class ProgramReservationInfoDto {

    private Long programId;
    private String programTitle;
    private int programPrice;

    private Long stayId;
    private String stayName;

    private Long officeId;
    private String officeName;

    private List<RoomSimpleDto> rooms;

}
