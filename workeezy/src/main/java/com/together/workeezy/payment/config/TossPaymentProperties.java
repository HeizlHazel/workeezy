package com.together.workeezy.payment.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "toss.payments")
public class TossPaymentProperties {

    private String secretKey;
    private String clientKey;
    private String baseUrl;

}
