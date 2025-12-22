package com.together.workeezy.program.program.interfaces.dto;

import com.together.workeezy.program.program.domain.model.entity.RoomType;
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
