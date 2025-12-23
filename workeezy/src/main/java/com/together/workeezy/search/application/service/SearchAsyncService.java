package com.together.workeezy.search.application.service;

import com.together.workeezy.program.program.domain.model.entity.Place;
import com.together.workeezy.program.program.domain.model.entity.Program;
import com.together.workeezy.program.program.domain.repository.PlaceRepository;
import com.together.workeezy.program.program.domain.repository.ProgramRepository;
import com.together.workeezy.search.domain.model.entity.Search;
import com.together.workeezy.search.domain.model.entity.SearchProgram;
import com.together.workeezy.search.domain.model.repository.SearchProgramRepository;
import com.together.workeezy.search.domain.model.value.PlaceSearchView;
import com.together.workeezy.search.domain.service.SearchSimilarityCalculator;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SearchAsyncService {

    private final PlaceRepository placeRepository;
    private final ProgramRepository programRepository;
    private final SearchProgramRepository searchProgramRepository;
    private final SearchSimilarityCalculator calculator;

    /**
     * 검색 유사도 계산 (비동기)
     */
    @Async
    @Transactional
    public void calculateSimilarityAsync(
            Search search,
            List<Long> programIds,
            String keyword
    ) {

        Long searchId = search.getId();

        // 1️⃣ 기존 검색 결과 제거
        searchProgramRepository.deleteAll(
                searchProgramRepository.findBySearchIdOrderBySearchPointDesc(searchId)
        );

        if (programIds.isEmpty()) return;

        // 2️⃣ Place 한 번에 조회 (N+1 제거)
        List<Place> allPlaces = placeRepository.findByProgramIds(programIds);

        Map<Long, List<Place>> placeMap = allPlaces.stream()
                .collect(Collectors.groupingBy(
                        p -> p.getProgram().getId()
                ));

        // 3️⃣ programId 기준으로 유사도 계산
        for (Long programId : programIds) {

            // ✅ Program은 reference만 사용 (setter ❌, new ❌)
            Program programRef = programRepository.getReferenceById(programId);

            // 4️⃣ 엔티티 → 검색용 값 객체 변환
            List<PlaceSearchView> placeViews =
                    placeMap.getOrDefault(programId, List.of())
                            .stream()
                            .map(p -> new PlaceSearchView(
                                    p.getPlaceRegion(),
                                    p.getPlaceAddress(),
                                    p.getPlaceEquipment()
                            ))
                            .toList();

            // 5️⃣ 유사도 계산 (엔티티 의존 ❌)
            int score = calculator.calculate(
                    programRef.getTitle(),
                    programRef.getProgramInfo(),
                    placeViews,
                    keyword
            );

            if (score <= 0) continue;

            // 6️⃣ SearchProgram 생성 (팩토리 메서드)
            SearchProgram searchProgram = SearchProgram.create(
                    search,
                    programRef,
                    score
            );

            searchProgramRepository.save(searchProgram);
        }
    }
}
