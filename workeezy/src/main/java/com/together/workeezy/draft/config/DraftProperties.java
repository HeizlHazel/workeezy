package com.together.workeezy.draft.config;

import lombok.Getter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Component
@ConfigurationProperties(prefix = "draft")
public class DraftProperties {

    private int maxCount;
    private int ttlDays;

    public void setMaxCount(int maxCount) {
        this.maxCount = maxCount;
    }

    public void setTtlDays(int ttlDays) {
        this.ttlDays = ttlDays;
    }
}
