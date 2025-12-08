package com.together.workeezy.program.dto;

import com.together.workeezy.program.entity.RoomType;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RoomDto {
    private Long id;
    private Integer roomNo;
    private Integer roomPeople;
    private String roomService;
    private RoomType roomType;
}
