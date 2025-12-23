package com.together.workeezy.search.interfaces.dto;

import com.together.workeezy.program.program.interfaces.dto.ProgramCardDto;

import java.util.List;

public record SearchResultDto(
        List<ProgramCardDto> cards,
        List<ProgramCardDto> recommended
) {
}
