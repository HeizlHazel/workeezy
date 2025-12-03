package com.together.workeezy.program.controller;

import com.together.workeezy.program.dto.ProgramCardDto;
import com.together.workeezy.program.entity.Program;
import com.together.workeezy.program.repository.PlaceRepository;
import com.together.workeezy.program.repository.ProgramRepository;
import com.together.workeezy.program.service.ProgramService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/programs")
@RequiredArgsConstructor
public class ProgramController {

    private final ProgramRepository programRepository;
    private final PlaceRepository placeRepository;
    private final ProgramService programService;

    @GetMapping
    public List<Program> getAll() {
        return programRepository.findAll();
    }

    @GetMapping("/{id}")
    public Program getById(@PathVariable Long id) {
        return programRepository.findById(id).orElse(null);
    }

    @GetMapping("/cards")
    public List<ProgramCardDto> getCards() {

        List<Program> programs = programRepository.findAll();

        return programs.stream()
                .map(p -> new ProgramCardDto(
                        p.getId(),
                        p.getTitle(),
                        placeRepository.findPhotosByProgramId(p.getId())
                                .stream()
                                .findFirst()
                                .orElse(null),
                        p.getProgramPrice()
                ))
                .toList();
    }

    @GetMapping("/search")
    public List<ProgramCardDto> search(
            @RequestParam String keyword,
            @RequestParam(required = false) String region
    ) {
        return programService.search(keyword, region);
    }

}
