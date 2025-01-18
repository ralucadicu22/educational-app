package com.example.educational_app.controllers;

import com.example.educational_app.entities.User;
import com.example.educational_app.repository.UserRepository;
import com.example.educational_app.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/register")
public class RegistrationController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public RegistrationController(
            UserService userService,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping
    public ResponseEntity<String> register(@RequestBody User user) {
        String plainPassword = user.getPassword();
        user.setPassword(passwordEncoder.encode(plainPassword));

        User tempUser = new User();
        tempUser.setUsername(user.getUsername());
        tempUser.setPassword(plainPassword);
        tempUser.setRole(user.getRole());

        userService.addKeycloakUser(tempUser);
        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully");
    }
}
