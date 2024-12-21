package com.example.educational_app.controllers;

import com.example.educational_app.entities.User;
import com.example.educational_app.repository.UserRepository;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final String tokenUrl = "http://localhost:8080/realms/educationalApp/protocol/openid-connect/token";
    private final String clientId = "educational-web-app";
    private final String clientSecret = "vyuhQKLWo05IMO3zPIhNil4Y4XW6GtJq";

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {

        User dbUser = userRepository.findByUsername(user.getUsername());
        if (dbUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("User not found");
        }
        if (!passwordEncoder.matches(user.getPassword(), dbUser.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Wrong user & password");
        }
        RestTemplate restTemplate = new RestTemplate();

        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("grant_type", "password");
        formData.add("client_id", clientId);
        formData.add("client_secret", clientSecret);
        formData.add("username", user.getUsername());
        formData.add("password", user.getPassword());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<MultiValueMap<String, String>> requestEntity
                = new HttpEntity<>(formData, headers);

        try {
            ResponseEntity<Map> tokenResponse = restTemplate.postForEntity(
                    tokenUrl,
                    requestEntity,
                    Map.class
            );

            if (tokenResponse.getStatusCode().is2xxSuccessful()) {
                return ResponseEntity.ok(tokenResponse.getBody());
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Failed to authenticate with Keycloak");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Failed to connect to Keycloak: " + e.getMessage());
        }
    }
}