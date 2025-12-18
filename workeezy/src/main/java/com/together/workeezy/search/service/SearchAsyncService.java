package com.together.workeezy.search.service;

import com.together.workeezy.program.entity.Place;
import com.together.workeezy.program.entity.Program;
import com.together.workeezy.program.repository.PlaceRepository;
import com.together.workeezy.search.entity.Search;
import com.together.workeezy.search.entity.SearchProgram;
import com.together.workeezy.search.repository.SearchProgramRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SearchAsyncService {

    private final PlaceRepository placeRepository;
    private final SearchProgramRepository searchProgramRepository;
    private final SearchSimilarityCalculator calculator;

    @Async
    @Transactional
    public void calculateSimilarityAsync(Search search, List<Long> programIds, String keyword) {

        Long searchId = search.getId();

        searchProgramRepository.deleteAll(
                searchProgramRepository.findBySearchIdOrderBySearchPointDesc(searchId)
        );

        // ✅ place를 한 번에 가져와서 programId별로 그룹핑
        List<Place> allPlaces = placeRepository.findByProgramIds(programIds);
        var placeMap = allPlaces.stream()
                .collect(java.util.stream.Collectors.groupingBy(p -> p.getProgram().getId()));

        for (Long programId : programIds) {
            // 여기서 Program 엔티티가 필요하면 programRepository.getReferenceById(programId)로 reference만 사용
            Program programRef = new Program();
            programRef.setId(programId);

            List<Place> places = placeMap.getOrDefault(programId, List.of());

            int score = calculator.calculate(programRef, places, keyword);
            // ⚠️ calculator가 Program의 title/info를 쓰면 여기서 참조만으로는 부족하니,
            // 필요한 필드만 따로 조회하거나, calculator 입력을 cardView/문자열로 바꾸는 게 베스트.

            if (score <= 0) continue;

            SearchProgram sp = new SearchProgram();
            sp.setSearch(search);

            Program p = new Program();
            p.setId(programId);
            sp.setProgram(p);

            sp.setSearchPoint(score);

            searchProgramRepository.save(sp);
        }
    }

}
