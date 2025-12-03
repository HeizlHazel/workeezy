package com.together.workeezy.program.service;

import com.together.workeezy.program.dto.ProgramCardDto;
import com.together.workeezy.program.entity.Program;
import com.together.workeezy.program.repository.PlaceRepository;
import com.together.workeezy.program.repository.ProgramRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class ProgramService {

    private final ProgramRepository programRepository;
    private final PlaceRepository placeRepository;

    public List<ProgramCardDto> search(String keyword, String region) {
        List<Program> programs = programRepository.searchByKeyword(keyword);

        return programs.stream()
                .map(p -> new ProgramCardDto(
                        p.getId(),
                        p.getTitle(),
                        placeRepository.findPhotosByProgramId(p.getId()).stream().findFirst().orElse(null),
                        p.getProgramPrice()
                ))
                .toList();
    }

}
