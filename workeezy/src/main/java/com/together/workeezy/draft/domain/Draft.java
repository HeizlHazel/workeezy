package com.together.workeezy.draft.domain;

import java.util.Map;

public class Draft {

    private final DraftId id;
    private final Long userId;
    private final Map<String, Object> data;

    public Draft(DraftId id, Long userId, Map<String, Object> data) {
        this.id = id;
        this.userId = userId;
        this.data = data;
    }

    public DraftId getId() { return id; }
    public Long getUserId() { return userId; }
    public Map<String, Object> getData() { return data; }
}
