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
    private final UserRepository userRepository;

    @Transactional
    public SearchResultDto search(String keyword, List<String> regions, Long userId) {

        Search search = null;
        if (userId != null && keyword != null && !keyword.isBlank()) {
            User user = User.reference(userId);

            search = new Search(user, keyword);
            searchRepository.save(search);

            recentSearchService.saveKeyword(userId, keyword);
        }

        // ✅ 1) 검색: programId만 1번 조회
        List<Long> matchedIds = programRepository.searchProgramIdsByKeyword(keyword);

        // ✅ 2) 지역 필터는 일단 카드에서 처리(빠르게 적용) - 더 최적화하려면 SQL에서 IN 처리
        List<ProgramCardDto> cards = List.of();
        if (!matchedIds.isEmpty()) {
            var views = programRepository.findProgramCardsByIds(matchedIds);

            cards = views.stream()
                    .map(v -> new ProgramCardDto(v.getId(), v.getTitle(), v.getPhoto(), v.getPrice(), v.getRegion()))
                    .toList();

            if (regions != null && !regions.isEmpty()) {
                cards = cards.stream()
                        .filter(c -> c.getRegion() != null && regions.contains(c.getRegion()))
                        .toList();
            }
        }

        // ✅ 3) 비동기 유사도 계산: Program 리스트 말고 ID 리스트로 넘김
        if (search != null && !matchedIds.isEmpty()) {
            asyncService.calculateSimilarityAsync(search, matchedIds, keyword);
        }

        // ✅ 4) 추천: search_program에 저장된 programId들만 뽑아서 카드 한방 조회
        List<ProgramCardDto> recommended = List.of();
        if (search != null) {
            List<Long> recIds = searchProgramRepository
                    .findBySearchIdOrderBySearchPointDesc(search.getId())
                    .stream()
                    .filter(sp -> sp.getSearchPoint() > 0)
                    .map(sp -> sp.getProgram().getId())  // 여기도 더 줄이려면 programId만 뽑는 쿼리로 변경 가능
                    .distinct()
                    .limit(5)
                    .toList();

            if (!recIds.isEmpty()) {
                var recViews = programRepository.findProgramCardsByIds(recIds);
                // IN절 순서 깨질 수 있으니 recIds 순서 복원
                var map = recViews.stream().collect(java.util.stream.Collectors.toMap(v -> v.getId(), v -> v));
                recommended = recIds.stream()
                        .map(map::get)
                        .filter(java.util.Objects::nonNull)
                        .map(v -> new ProgramCardDto(v.getId(), v.getTitle(), v.getPhoto(), v.getPrice(), v.getRegion()))
                        .toList();
            }
        }

        return new SearchResultDto(cards, recommended);
    }
}
