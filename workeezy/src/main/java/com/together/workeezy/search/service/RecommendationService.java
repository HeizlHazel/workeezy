package com.together.workeezy.search.service;

import com.together.workeezy.program.dto.ProgramCardDto;
import com.together.workeezy.program.dto.ProgramCardView;
import com.together.workeezy.program.repository.ProgramRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class RecommendationService {

    private final RecentSearchService recentSearchService;
    private final ProgramRepository programRepository;

    public List<ProgramCardDto> recommendByRecentSearch(Long userId) {

        int limit = 10;

        if (userId == null) return fallback(limit);

        // ✅ 최근 검색어 1개만 가져오기 (index 0 = 최신)
        List<String> recentKeywords = recentSearchService.getRecentKeywords(userId, 1);
        if (recentKeywords.isEmpty()) return fallback(limit);

        String latestKeyword = recentKeywords.get(0);

        // ✅ 최신 검색어로만 후보 프로그램 ID 조회
        List<Long> ids = programRepository.searchProgramIdsByKeyword(latestKeyword);
        if (ids == null || ids.isEmpty()) return fallback(limit);

        // ✅ 중복 제거 + limit 적용
        List<Long> topIds = ids.stream()
                .distinct()
                .limit(limit)
                .toList();

        // ✅ 카드 한방 조회 후, topIds 순서로 복원
        var views = programRepository.findProgramCardsByIds(topIds);

        Map<Long, ProgramCardView> map = new HashMap<>();
        for (var v : views) map.put(v.getId(), v);

        List<ProgramCardDto> result = new ArrayList<>();
        for (Long id : topIds) {
            var v = map.get(id);
            if (v != null) {
                result.add(new ProgramCardDto(
                        v.getId(), v.getTitle(), v.getPhoto(), v.getPrice(), v.getRegion()
                ));
            }
        }

        return result.isEmpty() ? fallback(limit) : result;
    }


    private List<ProgramCardDto> fallback(int limit) {
        return programRepository.findAllProgramCardsOrderByIdAsc(limit)
                .stream()
                .map(this::toDto)
                .toList();
    }

    private ProgramCardDto toDto(ProgramCardView v) {
        return new ProgramCardDto(
                v.getId(),
                v.getTitle(),
                v.getPhoto(),
                v.getPrice(),
                v.getRegion()
        );
    }
}
