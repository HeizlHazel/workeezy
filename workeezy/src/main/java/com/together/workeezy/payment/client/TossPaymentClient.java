package com.together.workeezy.payment.client;

import com.together.workeezy.payment.config.TossPaymentProperties;
import com.together.workeezy.payment.dto.TossConfirmResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TossPaymentClient {

    private final WebClient webClient;
    private final TossPaymentProperties props;

    public TossConfirmResponseDto confirm(String paymentKey,
                                          String orderId,
                                          long amount) {
        // 1. Basic Auth 헤더 만들기 (secretKey:)
        // 2. body: paymentKey, orderId, amount
        // 3. POST /v1/payments/confirm 호출
        // 4. 성공 시 TossConfirmResponseDto 로 매핑
    }
}
