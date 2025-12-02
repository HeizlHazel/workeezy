package com.together.workeezy;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
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