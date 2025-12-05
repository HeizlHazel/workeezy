package com.together.workeezy.program.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RoomDto {
    private Long id;
    private Integer roomNo;
    private Integer roomPeople;
    private String roomService;
}
