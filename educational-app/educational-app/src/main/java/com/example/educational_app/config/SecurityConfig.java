package com.example.educational_app.config;

import com.fasterxml.jackson.databind.DeserializationFeature;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;


import javax.ws.rs.HttpMethod;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("http://localhost:5173");
        configuration.setAllowCredentials(true);
        configuration.addAllowedHeader("*");
        configuration.addAllowedMethod("*");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(auth -> auth
                .requestMatchers("/register", "/auth/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/courses").hasRole("Teacher")
                .requestMatchers(HttpMethod.POST, "/courses/enroll").hasRole("Student")
                .requestMatchers(HttpMethod.GET, "/courses/my-created").hasRole("Teacher")
                .requestMatchers(HttpMethod.GET, "/courses/my-enrolled").hasRole("Student")
                .requestMatchers(HttpMethod.POST, "/course-files/upload").hasRole("Teacher")
                .requestMatchers(HttpMethod.DELETE, "/course-files/{fileId}").hasRole("Teacher")
                .requestMatchers(HttpMethod.POST, "/courses/create").hasRole("Teacher")
                .requestMatchers(HttpMethod.GET, "/courses/{courseId}").hasAnyRole("Student", "Teacher")
                .requestMatchers(HttpMethod.POST, "/quizzes/create").hasRole("Teacher")
                .requestMatchers(HttpMethod.GET, "/attempts/all/{quizId}").hasRole("Teacher")
                .requestMatchers(HttpMethod.POST, "/attempts/submit/*").hasRole("Student")
                .requestMatchers(HttpMethod.GET, "/auth/me").authenticated()
                .requestMatchers( "/attempts/leaderboard/course/*").hasAnyRole("Student", "Teacher")
                .requestMatchers(
                        "/forum/posts",
                        "/forum/comments/*",
                        "/forum/posts/{postId}").permitAll()
                .requestMatchers(
                        "/forum/posts/create",
                        "/forum/comments",
                        "/forum/comments/*/like/*",
                        "/forum/comments/*/dislike/*",
                        "/forum/comments/reply/*").authenticated()
                .anyRequest().authenticated()
        );
        http.oauth2ResourceServer(oauth2 ->
                oauth2.jwt(jwt ->
                        jwt.jwtAuthenticationConverter(jwtAuthenticationConverter())
                )
        );
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()));
        http.csrf(csrf -> csrf.disable());


        return http.build();
    }

    @Bean
    JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter jwtConverter = new JwtAuthenticationConverter();
        jwtConverter.setJwtGrantedAuthoritiesConverter(jwt -> {
            Collection<GrantedAuthority> authorities = new ArrayList<>();

            JwtGrantedAuthoritiesConverter realmRolesConverter = new JwtGrantedAuthoritiesConverter();
            realmRolesConverter.setAuthoritiesClaimName("realm_access.roles");
            realmRolesConverter.setAuthorityPrefix("ROLE_");
            authorities.addAll(realmRolesConverter.convert(jwt));

            Map<String, Object> resourceAccess = jwt.getClaim("resource_access");
            if (resourceAccess != null) {
                Map<String, Object> clientAccess = (Map<String, Object>) resourceAccess.get("educational-web-app");
                if (clientAccess != null) {
                    List<String> clientRoles = (List<String>) clientAccess.get("roles");
                    if (clientRoles != null) {
                        for (String role : clientRoles) {
                            authorities.add(new SimpleGrantedAuthority("ROLE_" + role));
                        }
                    }
                }
            }
            return authorities;
        });

        return jwtConverter;

    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
