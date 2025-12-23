package com.together.workeezy.search.domain.service;

import com.together.workeezy.search.domain.model.value.PlaceSearchView;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class SearchSimilarityCalculator {

    public int calculate(
            String programTitle,
            String programInfo,
            List<PlaceSearchView> places,
            String keyword
    ) {

        if (keyword == null || keyword.isBlank()) return 0;

        String k = keyword.trim().toLowerCase();
        int score = 0;

        // -----------------------------
        // 1) 프로그램 제목
        // -----------------------------
        String title = safeLower(programTitle);
        if (title != null) {
            if (title.equals(k)) score += 80;
            else if (title.startsWith(k)) score += 60;
            else if (title.contains(k)) score += 40;
        }

        // -----------------------------
        // 2) 프로그램 설명
        // -----------------------------
        String info = safeLower(programInfo);
        if (info != null && info.contains(k)) {
            score += 25;
        }

        // -----------------------------
        // 3) 장소 정보 (중복 가산 방지)
        // -----------------------------
        boolean regionMatched = false;
        boolean addressMatched = false;
        boolean seaBonusGiven = false;
        boolean workEnvBonusGiven = false;

        for (PlaceSearchView place : places) {

            String region = safeLower(place.getRegion());
            String addr   = safeLower(place.getAddress());
            String equip  = safeLower(place.getEquipment());

            if (!regionMatched && region != null) {
                if (region.equals(k)) {
                    score += 40;
                    regionMatched = true;
                } else if (region.contains(k)) {
                    score += 25;
                    regionMatched = true;
                }
            }

            if (!addressMatched && addr != null && addr.contains(k)) {
                score += 20;
                addressMatched = true;
            }

            if (equip != null) {

                if (!seaBonusGiven &&
                        (equip.contains("바다") || equip.contains("오션뷰") || equip.contains("해변"))) {
                    score += 10;
                    seaBonusGiven = true;
                }

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
