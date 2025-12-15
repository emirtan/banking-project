package com.oredata.banking_api.config.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable) // CSRF korumasını kapat
                .authorizeHttpRequests(auth -> auth
                        // HALKA AÇIK ENDPOINTLER (Login ve Register)
                        .requestMatchers("/api/users/register", "/api/users/login").permitAll()

                        // Swagger Dokümantasyonu (Test için açık kalsın)
                        .requestMatchers(
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html")
                        .permitAll()
                        .requestMatchers("/error").permitAll()
                        // Geri kalan her şey için TOKEN ZORUNLU
                        .anyRequest().authenticated())
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Session tutma
                                                                                                        // (Stateless)
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class); // Filtreyi devreye al

        return http.build();
    }

    // YENİ BEAN: Tüm kaynaklardan gelen isteklere izin veren CORS konfigürasyonu
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Allow requests from development environment (Frontend URL)
        configuration.setAllowedOrigins(Collections.singletonList("http://localhost:5173"));
        // configuration.setAllowedOriginPatterns(Collections.singletonList("*")); //
        // INSECURE, REMOVED

        // İzin verilen HTTP metotları
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

        // İzin verilen tüm HTTP başlıkları
        configuration.setAllowedHeaders(Collections.singletonList("*"));

        // Çerezler ve kimlik doğrulama bilgileriyle birlikte istek göndermeye izin ver
        configuration.setAllowCredentials(true);

        // CORS ayarlarını tüm yollara uygula
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}