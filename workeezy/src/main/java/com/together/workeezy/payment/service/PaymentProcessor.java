package com.together.workeezy.payment.service;

import com.together.workeezy.payment.client.TossPaymentClient;
import com.together.workeezy.payment.dto.response.TossConfirmResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PaymentProcessor {

    private final TossPaymentClient tossPaymentClient;

    public TossConfirmResponse confirm(String paymentKey, String orderId, Long amount) {
        // 여기서 로깅/리트라이/에러 매핑 등의 cross-cutting concern도 처리 가능
        return tossPaymentClient.confirm(paymentKey, orderId, amount);
    }
}
