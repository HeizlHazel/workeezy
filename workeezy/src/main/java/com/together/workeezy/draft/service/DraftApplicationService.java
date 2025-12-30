package com.together.workeezy.draft.service;

import com.together.workeezy.draft.config.DraftProperties;
import com.together.workeezy.draft.domain.DraftId;
import com.together.workeezy.draft.repository.DraftRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class DraftApplicationService {

    private final DraftRepository draftRepository;
    private final DraftProperties draftProperties;

    public DraftId saveDraft(Long userId, Map<String, Object> draftData) {
        // 임시저장 개수 제한
        int currentCount = draftRepository.findAllAsKeyDataList(userId).size();
        if (currentCount >= draftProperties.getMaxCount()) {
            throw new IllegalStateException("임시저장은 최대 " + draftProperties.getMaxCount() +"개까지만 가능합니다.<br/>기존 임시저장을 삭제한 후 다시 시도해주세요.");
        }

        Map<String, Object> dataWithTime = new HashMap<>();

        if (draftData != null) {
            dataWithTime.putAll(draftData);
        }

        //  프론트에서 data.savedAt 쓰고 있으니 "문자열"로 유지 (기존과 동일)
        dataWithTime.put("savedAt", new Date().toString());

        return draftRepository.save(userId, dataWithTime);
    }

    public List<Map<String, Object>> getDraftList(Long userId) {
        return draftRepository.findAllAsKeyDataList(userId);
    }

    public Map<String, Object> getDraftData(Long userId, String rawKey) {
        DraftId key = DraftId.of(rawKey);

        if (!key.isOwnedBy(userId)) {
            throw new AccessDeniedException("본인 데이터만 조회할 수 있습니다.");
        }

        return draftRepository.findDataByKey(key)
                .orElseThrow(() -> new NoSuchElementException("임시저장을 찾을 수 없습니다."));
    }

    public void deleteDraft(Long userId, String rawKey) {
        DraftId key = DraftId.of(rawKey);

        if (!key.isOwnedBy(userId)) {
            throw new AccessDeniedException("본인 데이터만 삭제할 수 있습니다.");
        }

        draftRepository.delete(key);
    }
}