package com.together.workeezy.payment.controller;

import com.together.workeezy.auth.security.user.CustomUserDetails;
import com.together.workeezy.payment.dto.request.PaymentConfirmRequest;
import com.together.workeezy.payment.dto.response.PaymentConfirmResponse;
import com.together.workeezy.payment.service.PaymentFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentFacade paymentFacade;

    @PostMapping("/confirm")
    public ResponseEntity<PaymentConfirmResponse> confirmPayment(
            @RequestBody PaymentConfirmRequest request,
            @AuthenticationPrincipal CustomUserDetails user) {

        // user.getEmail() 가져오기
        String email = user.getUsername();

        return ResponseEntity.ok(
                paymentFacade.confirm(request, email));
    }
}