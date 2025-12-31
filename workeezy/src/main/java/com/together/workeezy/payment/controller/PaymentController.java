package com.together.workeezy.payment.controller;

import com.together.workeezy.auth.security.user.CustomUserDetails;
import com.together.workeezy.payment.dto.request.PaymentConfirmRequest;
import com.together.workeezy.payment.dto.response.PaymentConfirmResponse;
import com.together.workeezy.payment.dto.response.PaymentReadyResponse;
import com.together.workeezy.payment.service.PaymentFacade;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentFacade paymentFacade;

    @GetMapping("/{reservationId:\\d+}")
    public PaymentReadyResponse getPaymentReady(
            @PathVariable Long reservationId,
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        log.info("🔥 PaymentReady 진입");
        log.info("🔥 reservationId = {}", reservationId);
        log.info("🔥 user = {}", user);

        return paymentFacade.getPaymentReadyInfo(
                reservationId,
                user.getUserId()
        );
    }

    @PostMapping("/confirm")
    public ResponseEntity<PaymentConfirmResponse> confirmPayment(
            @RequestBody PaymentConfirmRequest request) {
        log.info("🔥 confirm API called");

        return ResponseEntity.ok(
                paymentFacade.confirm(request, null));
    }

//    @GetMapping("/receipt/{reservationId}")
//    public ResponseEntity<PaymentConfirmResponse> getPayment(@PathVariable("reservationId") String reservationId) {
//    }

}