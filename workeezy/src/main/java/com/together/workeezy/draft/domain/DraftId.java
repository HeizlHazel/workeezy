package com.together.workeezy.draft.domain;

import java.util.Objects;

public final class DraftId {

    private final String value;

    private DraftId(String value) {
        this.value = value;
    }

    public static DraftId of(String rawKey) {
        if (rawKey == null || rawKey.isBlank()) {
            throw new IllegalArgumentException("draft key is required");
        }
        return new DraftId(rawKey);
    }

    public String value() {
        return value;
    }

    public boolean isOwnedBy(Long userId) {
        // 프론트/백엔드 기존 룰 그대로: "draft:{userId}"
        String prefix = "draft:" + userId;
        return value.startsWith(prefix);
    }

    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof DraftId)) return false;
        DraftId draftId = (DraftId) o;
        return Objects.equals(value, draftId.value);
    }

    @Override public int hashCode() {
        return Objects.hash(value);
    }
}

