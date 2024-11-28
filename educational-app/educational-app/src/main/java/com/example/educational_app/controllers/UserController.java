package com.example.educational_app.controllers;

import com.example.educational_app.entities.User;
import com.example.educational_app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserRepository userRepository;
    @PostMapping("/addUsers")
    @Transactional
    public User addUser(@RequestBody User user) {
        return userRepository.save(user);
    }
    @GetMapping("/allUsers")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
