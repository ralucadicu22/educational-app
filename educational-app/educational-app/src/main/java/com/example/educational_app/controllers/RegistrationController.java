package com.example.educational_app.controllers;
import com.example.educational_app.KeycloakHelper;
import com.example.educational_app.entities.User;
import com.example.educational_app.repository.UserRepository;
import com.example.educational_app.service.UserService;
import org.springframework.web.bind.annotation.*;
import org.keycloak.admin.client.resource.RealmResource;
import org.springframework.security.crypto.password.PasswordEncoder;

@RestController
@RequestMapping("/register")
public class RegistrationController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public RegistrationController(UserService userService, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping
    public String register(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userService.addKeycloakUser(user);
        userRepository.save(user);
        return "User registered successfully";
    }
}