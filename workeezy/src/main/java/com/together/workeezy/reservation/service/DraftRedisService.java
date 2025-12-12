package com.together.workeezy.reservation.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.core.Cursor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class DraftRedisService {

    @Qualifier("draftRedisTemplate")
    private final RedisTemplate<String, Object> draftRedisTemplate;

    private static final String DRAFT_PREFIX = "draft:";

    // 임시저장 생성
    public String saveDraft(Long userId, Object draftData) {

        Map<String, Object> dataWithTime = new HashMap<>();

        // drafData가 Map 형태일 경우 내부 데이터 복사
        if (draftData instanceof Map<?, ?> mapData) {
            dataWithTime.putAll((Map<String, Object>) mapData);
        }

        // 저장 시각 추가
        dataWithTime.put("savedAt", new Date().toString());
        
        // redis 키 생성
        String key = DRAFT_PREFIX + userId + ":" + System.currentTimeMillis(); // draft:hong@naver.com:1733301234567
        draftRedisTemplate.opsForValue().set(key, dataWithTime, 14, TimeUnit.DAYS);
        return key;

    }

    // 사용자별 임시저장 목록 조회
    public List<Map<String, Object>> getUserDrafts(Long userId) {
        String pattern = DRAFT_PREFIX + userId + "*";
        // Scan 명령 옵션 정의
        ScanOptions options = ScanOptions.scanOptions()
                .match(pattern) // 위 패턴과 일치하는 키만 스캔
                .count(100) // 한번에 최대 100개. 그렇제만 내부적으로 조절함(=정확하지 않다)
                .build();

        // Redis에서 꺼낸 값을 담을 리스트 생성
//        List<Object> results = new ArrayList<>();
        List<Map<String, Object>> results = new ArrayList<>();

        //Redis 연결 및 scan 실행
        try (
                // redis 서버와 통신할 실제 연결 가져옴
                // getConnection() : redis 서버와 네트워크 세션 열기
                RedisConnection connection = Objects.requireNonNull(
                        draftRedisTemplate.getConnectionFactory()
                ).getConnection();

                // scan 명령 실행
                Cursor<byte[]> cursor = connection.scan(options)

        ) {
            // 커서를 통해 Redis key들을 하나씩 읽기
            // cursor.hasNext() : 다음 키가 있으면 true
            // cursor.next() : 다음 키(byte[]) 꺼내기
            while (cursor.hasNext()) {
                // 꺼낸 key를 사람이 읽을 수 있도록 인코딩 설정
                String key = new String(cursor.next(), StandardCharsets.UTF_8);
                // 꺼낸 키로 실제 value(임시저장 데이터) 조회
                Object value = draftRedisTemplate.opsForValue().get(key);
                // null이 아닌 경우에만 결과에 추가
                if (value != null) {
                    // key랑 value를 함께 보내서 프론트에서 알게
                    results.add(Map.of(
                            "key", key,
                            "data", value));
                }
            }

        } catch (Exception e) {

            // SCAN이나 연결 중 문제가 생기면 예외 출력 (로그로 남길 수 있음)
            e.printStackTrace();
        }
        // 커서.close, 커넥션.close 가 호출되어 메모리/소켓 리소스 정리(redis 서버는 안 꺼짐.)
        // 이전 버전에서는 커넥션이 암묵적으로 닫혔지만 명시적으로 하면서 더 안전하고 명확!
        return results;
    }

    // 특정 임시저장 1개 불러오기
    public Object getDraftByKey(String key) {
        return draftRedisTemplate.opsForValue().get(key);
    }

    // 특정 임시저장 삭제
    public void deleteDraft(String key) {
        draftRedisTemplate.delete(key); // Redis 내부적으로 DEL key
    }
}
