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

        if (keyword == null || keyword.isBlank()) {
            return 0;
        }

        String k = keyword.trim().toLowerCase();

        int score = 0;

        // -----------------------------
        // 1) 프로그램 제목
        // -----------------------------
        String title = safeLower(program.getTitle());
        if (title != null) {
            if (title.equals(k)) {
                score += 80;           // 완전 일치
            } else if (title.startsWith(k)) {
                score += 60;           // 앞에 나올 때
            } else if (title.contains(k)) {
                score += 40;           // 어디든 포함
            }
        }

        // -----------------------------
        // 2) 프로그램 설명
        // -----------------------------
        String info = safeLower(program.getProgramInfo());
        if (info != null && info.contains(k)) {
            score += 25;
        }

        // -----------------------------
        // 3) 장소 정보
        //    - 여러 place가 있어도 같은 항목은 한 번만 가산
        // -----------------------------
        boolean regionMatched = false;
        boolean addressMatched = false;

        boolean seaBonusGiven = false;
        boolean workEnvBonusGiven = false;

        for (Place place : places) {

            String region = safeLower(place.getPlaceRegion());
            String addr   = safeLower(place.getPlaceAddress());
            String equip  = safeLower(place.getPlaceEquipment());

            // (1) 지역명 매칭
            if (!regionMatched && region != null) {
                if (region.equals(k)) {
                    score += 40;
                    regionMatched = true;
                } else if (region.contains(k)) {
                    score += 25;
                    regionMatched = true;
                }
            }

            // (2) 주소 매칭
            if (!addressMatched && addr != null && addr.contains(k)) {
                score += 20;
                addressMatched = true;
            }

            // (3) 시설 키워드 보너스 (워케이션에 유리한 요소들)
            if (equip != null) {

                // 바다/오션뷰/해변 한 번만 보너스
                if (!seaBonusGiven &&
                        (equip.contains("바다") || equip.contains("오션뷰") || equip.contains("해변"))) {
                    score += 10;
                    seaBonusGiven = true;
                }

                // 와이파이 / wifi / 회의실 / 모니터 / 프로젝터 / 프린터 등 업무환경
                if (!workEnvBonusGiven &&
                        (equip.contains("와이파이") || equip.contains("wifi")
                                || equip.contains("회의실") || equip.contains("회의 공간")
                                || equip.contains("모니터") || equip.contains("프로젝터")
                                || equip.contains("프린터"))) {
                    score += 10;
                    workEnvBonusGiven = true;
                }
            }
        }

        return score;
    }

    private String safeLower(String s) {
        return s == null ? null : s.toLowerCase();
    }
}
