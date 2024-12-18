package com.example.educational_app.controllers;

import com.example.educational_app.entities.User;
import com.example.educational_app.repository.UserRepository;
import org.springframework.http.ResponseEntity;
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

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        User dbUser = userRepository.findByUsername(user.getUsername());
        if (dbUser == null || !passwordEncoder.matches(user.getPassword(), dbUser.getPassword())) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }
        String tokenUrl = "http://localhost:8080/realms/educationalApp/protocol/openid-connect/token";
        RestTemplate restTemplate = new RestTemplate();

        Map<String, String> requestData = new HashMap<>();
        requestData.put("client_id", "educational-web-app");
        requestData.put("client_secret", "vyuhQKLWo05IMO3zPIhNil4Y4XW6GtJq");
        requestData.put("username", user.getUsername());
        requestData.put("password", user.getPassword());
        requestData.put("grant_type", "password");

        ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, requestData, Map.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            return ResponseEntity.ok(response.getBody());
        }

        return ResponseEntity.status(401).body("Failed to authenticate with Keycloak");
    }
}