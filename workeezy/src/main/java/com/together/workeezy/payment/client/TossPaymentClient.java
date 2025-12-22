package com.together.workeezy.payment.client;

import com.together.workeezy.payment.config.TossPaymentProperties;
import com.together.workeezy.payment.dto.response.TossConfirmResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Base64;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TossPaymentClient {

    private final WebClient webClient;
    private final TossPaymentProperties props;

    public TossConfirmResponse confirm(String paymentKey,
                                          String orderId,
                                          long amount) {

        // 1. Basic Auth 헤더 만들기 (secretKey:)
        // 2. body: paymentKey, orderId, amount
        Map<String, Object> body = Map.of(
                "paymentKey", paymentKey,
                "orderId", orderId,
                "amount", amount
        );
        // 3. POST /v1/payments/confirm 호출
        // 4. 성공 시 TossConfirmResponseDto 로 매핑

        // Basic Auth 준비
        String auth = props.getSecretKey() + ":";
        String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes());

        return webClient.post()
                .uri("/v1/payments/confirm")
                .header(HttpHeaders.AUTHORIZATION, "Basic " + encodedAuth)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(TossConfirmResponse.class)
                .block(); // 동기식으로 결과 받기
    }
}
