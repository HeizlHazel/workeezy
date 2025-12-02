package com.together.workeezy.search.dto;

import com.together.workeezy.program.dto.ProgramCardDto;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class SearchResultDto {
    private List<ProgramCardDto> cards;
    private List<ProgramCardDto> recommended;
}
