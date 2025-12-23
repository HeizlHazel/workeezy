package com.together.workeezy.search.application.service;

import com.together.workeezy.program.program.interfaces.dto.ProgramCardDto;
import com.together.workeezy.program.program.domain.repository.ProgramRepository;
import com.together.workeezy.search.domain.model.entity.Search;
import com.together.workeezy.search.interfaces.dto.SearchResultDto;
import com.together.workeezy.search.domain.model.repository.SearchProgramRepository;
import com.together.workeezy.search.domain.model.repository.SearchRepository;
import com.together.workeezy.user.entity.User;
import com.together.workeezy.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final SearchRepository searchRepository;
    private final SearchProgramRepository searchProgramRepository;
    private final ProgramRepository programRepository;
    private final SearchAsyncService asyncService;
    private final RecentSearchService recentSearchService;
    private final UserRepository userRepository;

    @Transactional
    public SearchResultDto search(String keyword, List<String> regions, Long userId) {

        Search search = null;

        // ===========================
        // 1️⃣ Search 생성 (도메인 규칙)
        // ===========================
        if (userId != null && keyword != null && !keyword.isBlank()) {

            User user = userRepository.getReferenceById(userId);

            search = Search.create(user, keyword);
            searchRepository.save(search);

            recentSearchService.saveKeyword(userId, keyword);
        }

        // ===========================
        // 2️⃣ 검색 결과 조회 (ID → 카드)
        // ===========================
        List<Long> matchedIds = programRepository.searchProgramIdsByKeyword(keyword);

        List<ProgramCardDto> cards = List.of();

        if (!matchedIds.isEmpty()) {
            var views = programRepository.findProgramCardsByIds(matchedIds);

            cards = views.stream()
                    .map(v -> new ProgramCardDto(
                            v.getId(),
                            v.getTitle(),
                            v.getPhoto(),
                            v.getPrice(),
                            v.getRegion()
                    ))
                    .toList();

            // 지역 필터 (프론트 필터)
            if (regions != null && !regions.isEmpty()) {
                cards = cards.stream()
                        .filter(c -> c.region() != null && regions.contains(c.region()))

                        .toList();
            }
        }

        // ===========================
        // 3️⃣ 비동기 유사도 계산
        // ===========================
        if (search != null && !matchedIds.isEmpty()) {
            asyncService.calculateSimilarityAsync(search, matchedIds, keyword);
        }

        // ===========================
        // 4️⃣ 추천 결과 조회
        // ===========================
        List<ProgramCardDto> recommended = List.of();

        if (search != null) {
            List<Long> recIds = searchProgramRepository
                    .findBySearchIdOrderBySearchPointDesc(search.getId())
                    .stream()
                    .filter(sp -> sp.getSearchPoint() > 0)
                    .map(sp -> sp.getProgram().getId())
                    .distinct()
                    .limit(5)
                    .toList();

            if (!recIds.isEmpty()) {
                var recViews = programRepository.findProgramCardsByIds(recIds);
                var map = recViews.stream()
                        .collect(Collectors.toMap(v -> v.getId(), v -> v));

                recommended = recIds.stream()
                        .map(map::get)
                        .filter(Objects::nonNull)
                        .map(v -> new ProgramCardDto(
                                v.getId(),
                                v.getTitle(),
                                v.getPhoto(),
                                v.getPrice(),
                                v.getRegion()
                        ))
                        .toList();
            }
        }

        return new SearchResultDto(cards, recommended);
    }
}
