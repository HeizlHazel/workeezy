package com.together.workeezy.program.program.interfaces.dto;

public record ProgramDto(
        Long id,
        String title,
        String programInfo,
        String programPeople,
        Long stayId,
        Long officeId,
        Long attractionId1,
        Long attractionId2,
        Long attractionId3
) {}
