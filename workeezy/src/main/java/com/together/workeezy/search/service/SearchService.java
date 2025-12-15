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
import com.together.workeezy.user.repository.UserRepository;
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
    private final SearchAsyncService asyncService;
    private final RecentSearchService recentSearchService;

    @Transactional
    public SearchResultDto search(String keyword, List<String> regions, Long userId) {

        // -----------------------------
        // 1) 검색 기록 저장
        // -----------------------------
        Search search = null;
        if (userId != null && keyword != null && !keyword.isBlank()) {
            User user = new User();
            user.setId(userId);

            search = new Search();
            search.setUser(user);
            search.setSearchPhrase(keyword);
            searchRepository.save(search);
            recentSearchService.saveKeyword(userId, keyword);

        }

        // -----------------------------
        // 2) 키워드 기반 검색
        // -----------------------------
        List<Program> matched = programRepository.searchByKeyword(keyword);

        // -----------------------------
        // 3) 지역 필터
        // -----------------------------
        if (regions != null && !regions.isEmpty()) {
            matched = matched.stream()
                    .filter(p -> p.getPlaces().stream()
                            .anyMatch(pl -> regions.contains(pl.getPlaceRegion())))
                    .toList();
        }

        // -----------------------------
        // 4) 유사도 계산은 비동기로 처리
        // -----------------------------
        if (search != null) {
            asyncService.calculateSimilarityAsync(search, matched, keyword);
        }

        // -----------------------------
        // 5) 추천은 "이전" 검색 기록 기준으로 제공됨
        // -----------------------------
        List<ProgramCardDto> recommended = List.of();
        if (search != null) {
            recommended =
                    searchProgramRepository
                            .findBySearchIdOrderBySearchPointDesc(search.getId())
                            .stream()
                            .filter(sp -> sp.getSearchPoint() > 0)
                            .map(SearchProgram::getProgram)
                            .distinct()
                            .limit(5)
                            .map(this::convert)
                            .toList();
        }

        // -----------------------------
        // 6) 검색 카드 변환
        // -----------------------------
        List<ProgramCardDto> cards = matched.stream()
                .distinct()
                .map(this::convert)
                .toList();

        return new SearchResultDto(cards, recommended);
    }

    private ProgramCardDto convert(Program p) {
        String region = p.getPlaces().stream()
                .filter(pl -> pl.getPlaceType() == PlaceType.stay)
                .map(Place::getPlaceRegion)
                .findFirst()
                .orElse(null);

        String photo = p.getPlaces().stream()
                .filter(pl -> pl.getPlacePhoto1() != null)
                .map(Place::getPlacePhoto1)
                .findFirst()
                .orElse(null);

        return new ProgramCardDto(
                p.getId(),
                p.getTitle(),
                photo,
                p.getProgramPrice(),
                region
        );
    }
}
