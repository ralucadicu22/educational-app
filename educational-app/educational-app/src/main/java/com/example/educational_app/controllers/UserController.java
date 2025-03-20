package com.example.educational_app.controllers;


import com.example.educational_app.entities.User;
import com.example.educational_app.repository.FollowRepository;
import com.example.educational_app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private FollowRepository followRepository;


    @PostMapping
    @Transactional
    public User addUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id=" + id));

        return ResponseEntity.ok(user);
    }
    @PutMapping("/{id}/update-subjects")
    @PreAuthorize("hasRole('Student') or hasRole('Teacher')")
    public ResponseEntity<?> updateFavoriteSubjects(@PathVariable Long id, @RequestBody List<String> subjects) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFavoriteSubjects(subjects);
        userRepository.save(user);

        return ResponseEntity.ok("Subjects updated successfully");
    }
    @GetMapping("/{id}/following")
    public ResponseEntity<List<User>> getUsersIFollow(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<User> following = followRepository.findFollowingByUser(user);

        return ResponseEntity.ok(following);
    }
}