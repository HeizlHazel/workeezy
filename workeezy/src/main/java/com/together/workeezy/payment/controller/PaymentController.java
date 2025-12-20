package com.together.workeezy.payment.controller;

import com.together.workeezy.auth.security.user.CustomUserDetails;
import com.together.workeezy.payment.dto.PaymentConfirmRequest;
import com.together.workeezy.payment.dto.PaymentConfirmResponse;
import com.together.workeezy.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/confirm")
    public ResponseEntity<PaymentConfirmResponse> confirmPayment(
            @RequestBody PaymentConfirmRequest request,
            @AuthenticationPrincipal CustomUserDetails user) {
        // 1. user.getEmail() 가져오기
        String email = user.getUsername();

        // 2. paymentService.confirmPayment(...) 호출
        PaymentConfirmResponse response = paymentService.confirmPayment(request, email);

        // 3. 결과 반환
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{reservationId}")
    public ResponseEntity<PaymentConfirmResponse> getPayment(@PathVariable Long reservationId) {
        return ResponseEntity.ok(paymentService.getPayment(reservationId));
    }

//    @GetMapping("/receipt/{reservationId}")
//    public ResponseEntity<PaymentConfirmResponse> getPayment(@PathVariable("reservationId") String reservationId) {
//    }

}
