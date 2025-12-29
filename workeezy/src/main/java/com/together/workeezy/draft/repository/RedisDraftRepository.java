package com.together.workeezy.draft.repository;

import com.together.workeezy.draft.config.DraftProperties;
import com.together.workeezy.draft.domain.DraftId;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.core.Cursor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.stereotype.Repository;

import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Repository
@RequiredArgsConstructor
public class RedisDraftRepository implements DraftRepository {
    private static final String DRAFT_PREFIX = "draft:";

    private final @Qualifier("draftRedisTemplate")
    RedisTemplate<String, Object> draftRedisTemplate;
    private final DraftProperties draftProperties;

    @Override
    public DraftId save(Long userId, Map<String, Object> dataWithSavedAt) {
        String key = DRAFT_PREFIX + userId + ":" + System.currentTimeMillis();
        draftRedisTemplate.opsForValue().set(key, dataWithSavedAt, draftProperties.getTtlDays(), TimeUnit.DAYS);
        return DraftId.of(key);
    }

    @Override
    public List<Map<String, Object>> findAllAsKeyDataList(Long userId) {
        String pattern = DRAFT_PREFIX + userId + "*";

        ScanOptions options = ScanOptions.scanOptions()
                .match(pattern)
                .count(100)
                .build();

        List<Map<String, Object>> results = new ArrayList<>();

        try (
                RedisConnection connection = Objects.requireNonNull(
                        draftRedisTemplate.getConnectionFactory()
                ).getConnection();

                Cursor<byte[]> cursor = connection.scan(options)
        ) {
            while (cursor.hasNext()) {
                String key = new String(cursor.next(), StandardCharsets.UTF_8);
                Object value = draftRedisTemplate.opsForValue().get(key);

                if (value != null) {
                    results.add(Map.of(
                            "key", key,
                            "data", value
                    ));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        // 최신순 정렬
        results.sort((a, b) -> {
            long ta = extractTimestamp((String) a.get("key"));
            long tb = extractTimestamp((String) b.get("key"));
            return Long.compare(tb, ta);
        });

        return results;
    }

    @Override
    public Optional<Map<String, Object>> findDataByKey(DraftId key) {
        Object value = draftRedisTemplate.opsForValue().get(key.value());
        if (value == null) return Optional.empty();

        // 현재 저장 값이 Map 형태라는 전제(네 코드와 동일)
        return Optional.of((Map<String, Object>) value);
    }

    @Override
    public void delete(DraftId key) {
        draftRedisTemplate.delete(key.value());
    }

    private long extractTimestamp(String key) {
        // draft:{userId}:{timestamp}
        String[] parts = key.split(":");
        return Long.parseLong(parts[2]);
    }
}