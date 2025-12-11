package com.together.workeezy.search.service;

import com.together.workeezy.program.dto.ProgramCardDto;
import com.together.workeezy.program.entity.Place;
import com.together.workeezy.program.entity.PlaceType;
import com.together.workeezy.program.entity.Program;
import com.together.workeezy.program.repository.ProgramRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final RecentSearchService recentSearchService;
    private final ProgramRepository programRepository;

    /**
     * 최근 검색어 기반 프로그램 추천
     */
    public List<ProgramCardDto> recommendByRecentSearch(Long userId) {

        // 로그인 안 했으면 추천 안 함
        if (userId == null) return List.of();

        // 1) 최근 검색어 최대 3개 사용 (최근일수록 가중치 높음)
        List<String> recentKeywords = recentSearchService.getRecentKeywords(userId, 3);
        if (recentKeywords.isEmpty()) {
            return List.of();
        }

        Map<Program, Integer> scoreMap = new HashMap<>();

        int weight = recentKeywords.size(); // 최신 검색어일수록 점수 높게

        for (String keyword : recentKeywords) {
            List<Program> programs = programRepository.searchByKeyword(keyword);

            for (Program program : programs) {
                scoreMap.put(program, scoreMap.getOrDefault(program, 0) + weight);
            }

            weight--; // 다음 검색어는 가중치 낮게
        }

        // 점수순 정렬
        return scoreMap.entrySet().stream()
                .sorted((a, b) -> b.getValue() - a.getValue())
                .limit(5) // 추천 5개 제한
                .map(entry -> convert(entry.getKey()))
                .toList();
    }


    /**
     * Program → ProgramCardDto 변환
     */
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
