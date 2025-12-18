package com.together.workeezy.program.controller;

import com.together.workeezy.program.dto.ProgramCardDto;
import com.together.workeezy.program.dto.ProgramDetailResponseDto;
import com.together.workeezy.program.entity.Program;
import com.together.workeezy.program.repository.ProgramRepository;
import com.together.workeezy.program.service.ProgramService;
import com.together.workeezy.program.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/programs")
@RequiredArgsConstructor
public class ProgramController {

    private final ProgramService programService;
    private final ReviewService reviewService;
    private final ProgramRepository  programRepository;

    /** 전체 프로그램 조회 */
    @GetMapping
    public List<Program> getAllPrograms() {
        return programService.getAllPrograms();
    }

    /** 프로그램 카드 목록 조회 */
    @GetMapping("/cards")
    public List<ProgramCardDto> getProgramCards() {
        return programRepository.findAllProgramCardsOrderByIdAsc(100).stream() // limit은 적당히
                .map(v -> new ProgramCardDto(v.getId(), v.getTitle(), v.getPhoto(), v.getPrice(), v.getRegion()))
                .toList();
    }


    /** 프로그램 상세 조회 (상세페이지 전용) */
    @GetMapping("/{id}")
    public ProgramDetailResponseDto getProgramDetail(@PathVariable Long id) {

        // 프로그램 상세 데이터
        ProgramDetailResponseDto dto = programService.getProgramDetail(id);

        // 상세페이지용 리뷰 리스트 주입
        dto.setReviews(reviewService.getReviewsByProgramId(id));

        return dto;
    }

}
