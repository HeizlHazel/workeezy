package com.together.workeezy.search.service;

import com.together.workeezy.program.dto.ProgramCardDto;
import com.together.workeezy.program.entity.Place;
import com.together.workeezy.program.entity.Program;
import com.together.workeezy.program.repository.PlaceRepository;
import com.together.workeezy.program.repository.ProgramRepository;
import com.together.workeezy.search.Search;
import com.together.workeezy.search.SearchProgram;
import com.together.workeezy.search.dto.SearchResultDto;
import com.together.workeezy.search.repository.SearchProgramRepository;
import com.together.workeezy.search.repository.SearchRepository;
import com.together.workeezy.user.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final SearchRepository searchRepository;
    private final SearchProgramRepository searchProgramRepository;
    private final ProgramRepository programRepository;
    private final PlaceRepository placeRepository;
    private final SearchSimilarityCalculator calculator;

    @Transactional
    public SearchResultDto search(String keyword, Long userId) {

        // 1) 검색 기록 저장
        Search search = new Search();
        User user = new User();
        user.setId(userId);
        search.setUser(user);
        search.setSearchPhrase(keyword);
        searchRepository.save(search);

        Long searchId = search.getId();

        // 2) 모든 프로그램 조회
        List<Program> allPrograms = programRepository.findAll();

        // 3) 기존 기록 삭제
        searchProgramRepository.deleteAll(
                searchProgramRepository.findBySearchIdOrderBySearchPointDesc(searchId)
        );

        // 4) 유사도 계산 + 저장
        for (Program program : allPrograms) {

            List<Place> places = placeRepository.findByProgramId(program.getId());
            int score = calculator.calculate(program, places, keyword);

            SearchProgram sp = new SearchProgram();
            sp.setSearch(search);
            sp.setProgram(program);
            sp.setSearchPoint(score);

            searchProgramRepository.save(sp);
        }

        // 5) 실제 검색 결과 카드
        List<Program> matched = programRepository.searchByKeyword(keyword);

        List<ProgramCardDto> cards = matched.stream()
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

        // 6) 추천 프로그램 (Top 5)
        List<SearchProgram> recommendedList =
                searchProgramRepository.findBySearchIdOrderBySearchPointDesc(searchId)
                        .stream()
                        .filter(sp -> sp.getSearchPoint() > 0)
                        .limit(5)
                        .toList();

        List<ProgramCardDto> recommendedCards = recommendedList.stream()
                .map(sp -> {
                    Program p = sp.getProgram();
                    return new ProgramCardDto(
                            p.getId(),
                            p.getTitle(),
                            placeRepository.findPhotosByProgramId(p.getId())
                                    .stream()
                                    .findFirst()
                                    .orElse(null),
                            p.getProgramPrice()
                    );
                })
                .toList();

        // 7) 결과 반환
        return new SearchResultDto(cards, recommendedCards);
    }
}
