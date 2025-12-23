package com.together.workeezy.program.program.interfaces.dto;

import com.together.workeezy.program.program.domain.model.entity.RoomType;

public record RoomDto(
        Long id,
        Integer roomNo,
        Integer roomPeople,
        String roomService,
        RoomType roomType
) {}
