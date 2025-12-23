package com.together.workeezy.program.program.interfaces;

import com.together.workeezy.program.program.interfaces.dto.ProgramCardDto;
import com.together.workeezy.program.program.interfaces.dto.ProgramDetailResponseDto;
import com.together.workeezy.program.program.interfaces.dto.ProgramReservationInfoDto;
import com.together.workeezy.program.program.domain.model.entity.Program;
import com.together.workeezy.program.program.domain.repository.ProgramRepository;
import com.together.workeezy.program.program.application.service.ProgramService;
import com.together.workeezy.program.review.application.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/programs")
@RequiredArgsConstructor
public class ProgramController {

    private final ProgramService programService;

    /** 전체 프로그램 조회 */
    @GetMapping
    public List<Program> getAllPrograms() {
        return programService.getAllPrograms();
    }

    /** 프로그램 카드 목록 조회 */
    @GetMapping("/cards")
    public List<ProgramCardDto> getProgramCards() {
        return programService.getProgramCards(100);
    }

    /** 프로그램 상세 조회 (상세페이지 전용) */
    @GetMapping("/{id}")
    public ProgramDetailResponseDto getProgramDetail(@PathVariable Long id) {
        return programService.getProgramDetail(id);
    }

    /** 예약용 프로그램 정보 조회 */
    @GetMapping("/{id}/reservation")
    public ProgramReservationInfoDto getProgramForReservation(
            @PathVariable Long id
    ) {
        return programService.getProgramForReservation(id);
    }
}

