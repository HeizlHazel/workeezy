package com.together.workeezy.config;

import com.together.workeezy.auth.security.filter.JwtAuthenticationFilter;
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

                        // GET → 공개
                        // POST / PUT / DELETE → 인증

                        // CORS Preflight 허용
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // 서버 상태 확인
                        .requestMatchers("/health", "/health/**").permitAll()

                        // Auth 공개 API
                        .requestMatchers("/api/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                        .requestMatchers("/api/auth/refresh").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/refresh").permitAll()
                        .requestMatchers("/api/auth/logout").authenticated()

                        // 비밀번호 재확인, 마이페이지용 보호
                        .requestMatchers("/api/auth/check-password").authenticated()
                        .requestMatchers("/api/user/**").authenticated()

                        // 공개 데이터 API
                        .requestMatchers("/api/programs/**").permitAll()
                        .requestMatchers("/api/search/**").permitAll()
                        .requestMatchers("/api/search").authenticated()
                        .requestMatchers("/api/search/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/reviews/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/reviews", "/api/reviews/**").permitAll()
                        .requestMatchers("/api/recommendations/**").authenticated()

                        .requestMatchers(HttpMethod.GET, "/api/reviews/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/reviews/**").permitAll()
                        .requestMatchers("/api/recommendations/**").permitAll()

                        .requestMatchers("/api/reservations/draft/**").authenticated()
                        .requestMatchers("/api/reservations/**").authenticated()

                        .requestMatchers(("/api/payments/**")).authenticated()

                        .requestMatchers("/api/**").authenticated()

                        // 에러 페이지
                        .requestMatchers("/error").permitAll()
                        .requestMatchers("/actuator/**").permitAll()

                        .anyRequest().authenticated()
                )
                .formLogin(login -> login.disable()) // 기본 로그인 form X
                .httpBasic(basic -> basic.disable()); // 브라우저 인증 팝업 X (Basic Auth)

        // JWT 필터가 스프링 필터 체인 앞에서 토큰 인증 처리
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // CORS React 허용
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // 허용 Origin
        config.setAllowedOrigins(List.of(
                "https://www.workeezy.cloud",
                "https://workeezy.cloud",
                "https://workeezy-react.vercel.app",
                "http://localhost:5173"
        ));

        // 허용 메서드 / 헤더
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));

        // 쿠키(Refresh Token) 허용
        config.setAllowCredentials(true);

        // 프론트에서 Authorization 헤더 접근 허용
        config.setExposedHeaders(List.of("Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 테스트 끝나고 반드시 삭제
    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web.debug(false);
    }
}
