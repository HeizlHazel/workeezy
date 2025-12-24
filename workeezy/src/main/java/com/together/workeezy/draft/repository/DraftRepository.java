package com.together.workeezy.draft.repository;

import com.together.workeezy.draft.domain.DraftId;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface DraftRepository {
    DraftId save(Long userId, Map<String, Object> dataWithSavedAt);

    List<Map<String, Object>> findAllAsKeyDataList(Long userId);
    // ↑ 프론트 응답 shape [{key,data}]를 그대로 만들기 위해 "그 형태"로 조회 제공

    Optional<Map<String, Object>> findDataByKey(DraftId key);

    void delete(DraftId key);
}
