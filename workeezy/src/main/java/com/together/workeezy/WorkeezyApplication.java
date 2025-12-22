package com.together.workeezy;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.security.crypto.password.PasswordEncoder;
@EnableAsync
@SpringBootApplication
@EntityScan(basePackages = "com.together.workeezy")
@EnableJpaRepositories(basePackages = "com.together.workeezy")
public class WorkeezyApplication {

//    private final PasswordEncoder passwordEncoder;
//
//    public WorkeezyApplication(PasswordEncoder passwordEncoder) {
//        this.passwordEncoder = passwordEncoder;
//    }

    public static void main(String[] args) {
		SpringApplication.run(WorkeezyApplication.class, args);
    }

//    @Bean
//    public CommandLineRunner commandLineRunner() {
//        return args -> {
//            System.out.println(passwordEncoder.encode("950218"));
//        };
//    }

}