package com.together.workeezy.search.service;

import com.together.workeezy.program.entity.Place;
import com.together.workeezy.program.entity.Program;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class SearchSimilarityCalculator {

    public int calculate(Program program, List<Place> places, String keyword) {

        int score = 0;

        // 1) 제목 포함 여부
        if (program.getTitle() != null && program.getTitle().contains(keyword)) {
            score += 50;
        }

        // 2) 설명 포함 여부
        if (program.getProgramInfo() != null && program.getProgramInfo().contains(keyword)) {
            score += 30;
        }

        // 3) 장소 기반 점수
        for (Place place : places) {

            // (1) 주소 포함 여부
            if (place.getPlaceAddress() != null && place.getPlaceAddress().contains(keyword)) {
                score += 40;
            }

            // (2) 시설 정보(place_equipment)에 기반한 유사도 점수
            if (place.getPlaceEquipment() != null) {

                String equip = place.getPlaceEquipment();

                // 바다 전망 / 해변 / 오션뷰 등 워케이션 핵심 키워드 강화
                if (equip.contains("바다")) score += 20;
                if (equip.contains("해변")) score += 20;
                if (equip.contains("오션뷰")) score += 20;
            }
        }

        return score;
    }
}
