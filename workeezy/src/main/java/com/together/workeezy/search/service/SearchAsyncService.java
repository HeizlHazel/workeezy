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

    @Async   // 🔥 비동기 실행
    @Transactional
    public void calculateSimilarityAsync(Search search, List<Program> matchedPrograms, String keyword) {

        Long searchId = search.getId();

        // 기존 데이터 삭제
        searchProgramRepository.deleteAll(
                searchProgramRepository.findBySearchIdOrderBySearchPointDesc(searchId)
        );

        // 유사도 계산 후 저장
        for (Program program : matchedPrograms) {

            List<Place> places = placeRepository.findByProgramId(program.getId());
            int score = calculator.calculate(program, places, keyword);

            SearchProgram sp = new SearchProgram();
            sp.setSearch(search);
            sp.setProgram(program);
            sp.setSearchPoint(score);

            searchProgramRepository.save(sp);
        }
    }
}
