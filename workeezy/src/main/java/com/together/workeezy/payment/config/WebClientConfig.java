package com.together.workeezy.payment.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
@RequiredArgsConstructor
public class WebClientConfig {

    private final TossPaymentProperties tossProps;

    @Bean
    public WebClient tossWebClient(){

        return WebClient.builder()
                .baseUrl(tossProps.getBaseUrl())   // https://api.tosspayments.com
                .defaultHeader(HttpHeaders.CONTENT_TYPE, "application/json")
                .build();
    }
}
