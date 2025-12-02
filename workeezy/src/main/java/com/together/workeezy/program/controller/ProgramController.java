package com.together.workeezy.program.controller;

import com.together.workeezy.program.dto.ProgramCardDto;
import com.together.workeezy.program.entity.Program;
import com.together.workeezy.program.repository.PlaceRepository;
import com.together.workeezy.program.repository.ProgramRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/programs")
@RequiredArgsConstructor
public class ProgramController {

    private final ProgramRepository programRepository;
    private final PlaceRepository placeRepository;

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
}
