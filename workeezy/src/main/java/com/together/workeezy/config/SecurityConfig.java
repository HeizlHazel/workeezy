package com.together.workeezy.config;

import com.together.workeezy.auth.security.filter.JwtAuthenticationFilter;
import com.together.workeezy.auth.security.jwt.JwtAuthenticationEntryPoint;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    // 인증 매니저
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable()) // JWT는 필요 x
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // CORS 허용
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // JWT 방식에서는 서버가 세션을 만들지 않음 REST API는 STATELESS

                // 경로별 권한 설정
                .authorizeHttpRequests(auth -> auth

                        // CORS Preflight 허용
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // health / actuator (로컬 확인용)
                        .requestMatchers("/health", "/health/**").permitAll()
                        .requestMatchers("/actuator/**").permitAll()


                        // Auth
                        .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/refresh").permitAll()
                        .requestMatchers("/api/auth/logout").authenticated()
                        .requestMatchers("/api/auth/check-password").authenticated()

                        // User
                        .requestMatchers("/api/user/**").authenticated()

                        // Programs / Reviews (공개 범위)
                        .requestMatchers("/api/programs/**").permitAll()
                        .requestMatchers("/api/reviews").permitAll()
                        .requestMatchers("/api/reviews/**").permitAll()

                        // Search / Recommend
                        .requestMatchers("/api/search/**").authenticated()
                        .requestMatchers("/api/recommendations/**").permitAll()

                        // Reservations / Payments
                        .requestMatchers("/api/reservations/availability/**").permitAll()
                        .requestMatchers("/api/reservations/draft/**").authenticated()
                        .requestMatchers("/api/reservations/me").authenticated()
                        .requestMatchers("/api/reservations/**").authenticated()
<<<<<<< HEAD
=======

>>>>>>> d0b47da (🔧 예약 가능 날짜 filter, security 수정)
                        .requestMatchers("/api/payments/confirm").permitAll()
                        .requestMatchers("/api/payments/**").authenticated()

                        // 관리자 전용
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // 챗봇
                        .requestMatchers("/api/chat/**").permitAll()

                        // error
                        .requestMatchers("/error").permitAll()

                        .anyRequest().authenticated()
                )
                .formLogin(login -> login.disable()) // 기본 로그인 form X
                .httpBasic(basic -> basic.disable()); // 브라우저 인증 팝업 X (Basic Auth)

        // JWT 필터가 스프링 필터 체인 앞에서 토큰 인증 처리
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(e -> e
                        .authenticationEntryPoint(jwtAuthenticationEntryPoint));

        return http.build();
    }

    // CORS React 허용
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:3000",
                "http://localhost:4173",
                "https://www.workeezy.cloud",
                "https://workeezy.cloud",
                "https://workeezy-react.vercel.app"
        ));


        config.setAllowedMethods(List.of(
                "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"
        ));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setExposedHeaders(List.of("Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web.debug(true);
    }
}
