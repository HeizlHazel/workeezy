package com.together.workeezy.payment.controller;

import com.together.workeezy.auth.security.user.CustomUserDetails;
import com.together.workeezy.payment.dto.PaymentConfirmRequest;
import com.together.workeezy.payment.dto.PaymentConfirmResponse;
import com.together.workeezy.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/confirm")
    public ResponseEntity<PaymentConfirmResponse> confirm(@RequestBody PaymentConfirmRequest request,
                                                          @AuthenticationPrincipal CustomUserDetails userDetails) {
        // 1. user.getEmail() 가져오기
        // 2. paymentService.confirmPayment(...) 호출
        // 3. 결과 반환
        return null;
    }

}
