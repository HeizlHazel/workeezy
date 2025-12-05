package com.together.workeezy.program.controller;

import com.together.workeezy.program.dto.ProgramCardDto;
import com.together.workeezy.program.dto.ProgramDetailResponseDto;
import com.together.workeezy.program.entity.Place;
import com.together.workeezy.program.entity.PlaceType;
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
    public List<Program> getAllPrograms() {
        return programRepository.findAll();
    }

    @GetMapping("/{id}")
    public ProgramDetailResponseDto getProgramDetail(@PathVariable Long id) {
        System.out.println("👉 ProgramDetail 요청 ID = " + id);
        return programService.getProgramDetail(id);
    }


    @GetMapping("/cards")
    public List<ProgramCardDto> getProgramCards() {

        List<Program> programs = programRepository.findAll();

        return programs.stream()
                .map(p -> {

                    // ⭐ Lazy 방지 → Repository로 직접 조회
                    String region = placeRepository.findRegionByProgramId(p.getId());

                    // 대표사진
                    String photo = placeRepository.findPhotosByProgramId(p.getId())
                            .stream().findFirst().orElse(null);

                    return new ProgramCardDto(
                            p.getId(),
                            p.getTitle(),
                            photo,
                            p.getProgramPrice(),
                            region
                    );
                })
                .toList();
    }




}

