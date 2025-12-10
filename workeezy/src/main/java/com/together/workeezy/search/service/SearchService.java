package com.together.workeezy.search.service;

import com.together.workeezy.program.dto.ProgramCardDto;
import com.together.workeezy.program.entity.Place;
import com.together.workeezy.program.entity.PlaceType;
import com.together.workeezy.program.entity.Program;
import com.together.workeezy.program.repository.PlaceRepository;
import com.together.workeezy.program.repository.ProgramRepository;
import com.together.workeezy.search.entity.Search;
import com.together.workeezy.search.entity.SearchProgram;
import com.together.workeezy.search.dto.SearchResultDto;
import com.together.workeezy.search.repository.SearchProgramRepository;
import com.together.workeezy.search.repository.SearchRepository;
import com.together.workeezy.user.entity.User;
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
    public SearchResultDto search(String keyword, List<String> regions, Long userId) {

        // 0) 사용자 정보
        User user = null;
        if (userId != null) {
            user = new User();
            user.setId(userId);
        }

        // 1) 검색 기록 저장
        Search search = null;
        if (user != null) {
            search = new Search();
            search.setUser(user);
            search.setSearchPhrase(keyword);
            searchRepository.save(search);
        }

        Long searchId = (search != null) ? search.getId() : null;

        // 2) 키워드 기반 프로그램 검색 (핵심)
        List<Program> matched = programRepository.searchByKeyword(keyword);

        // 3) 지역 필터 적용
        if (regions != null && !regions.isEmpty()) {
            matched = matched.stream()
                    .filter(p -> {
                        List<Place> places = placeRepository.findByProgramId(p.getId());
                        return places.stream()
                                .anyMatch(pl -> regions.contains(pl.getPlaceRegion()));
                    })
                    .toList();
        }

        // 4) 유사도 계산 (matched에만 수행)
        if (searchId != null) {
            for (Program program : matched) {
                List<Place> places = placeRepository.findByProgramId(program.getId());
                int score = calculator.calculate(program, places, keyword);

                SearchProgram sp = new SearchProgram();
                sp.setSearch(search);
                sp.setProgram(program);
                sp.setSearchPoint(score);

                searchProgramRepository.save(sp);
            }
        }

        // 5) 추천 TOP5
        List<ProgramCardDto> recommendedCards = List.of();
        if (searchId != null) {
            recommendedCards = searchProgramRepository
                    .findBySearchIdOrderBySearchPointDesc(searchId)
                    .stream()
                    .filter(sp -> sp.getSearchPoint() > 0)
                    .map(SearchProgram::getProgram)
                    .limit(5)
                    .map(this::convert)
                    .toList();
        }

        // 6) 검색 결과 카드 변환
        List<ProgramCardDto> matchedCards = matched.stream()
                .map(this::convert)
                .toList();

        return new SearchResultDto(matchedCards, recommendedCards);
    }


    private ProgramCardDto convert(Program p) {

        // region 가져오기
        String region = p.getPlaces().stream()
                .filter(pl -> pl.getPlaceType() == PlaceType.stay)
                .map(Place::getPlaceRegion)
                .findFirst()
                .orElse(null);

        // 대표 사진 가져오기
        String photo = placeRepository.findPhotosByProgramId(p.getId())
                .stream().findFirst().orElse(null);

        return new ProgramCardDto(
                p.getId(),
                p.getTitle(),
                photo,
                p.getProgramPrice(),
                region
        );
    }
}
