package com.example.educational_app.controllers;

import com.example.educational_app.entities.UserAttempt;
import com.example.educational_app.service.AttemptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/attempts")
public class AttemptController {

    @Autowired
    private AttemptService attemptService;

    @PostMapping("/submit/{quizId}")
    public ResponseEntity<UserAttempt> submitAttempt(@PathVariable Long quizId,
                                                     @RequestBody List<Long> selectedAnswers) {
        UserAttempt attempt = attemptService.submitAttempt(quizId, selectedAnswers);
        return ResponseEntity.ok(attempt);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserAttempt>> getAttemptsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(attemptService.getAttemptsByUser(userId));
    }

    @GetMapping("/quiz/{quizId}")
    public ResponseEntity<List<UserAttempt>> getAttemptsByQuiz(@PathVariable Long quizId) {
        return ResponseEntity.ok(attemptService.getAttemptsByQuiz(quizId));
    }
}
