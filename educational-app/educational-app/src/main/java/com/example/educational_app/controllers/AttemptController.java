package com.example.educational_app.controllers;

import com.example.educational_app.entities.User;
import com.example.educational_app.entities.UserAttempt;
import com.example.educational_app.entities.UserLeaderboard;
import com.example.educational_app.repository.AttemptRepository;
import com.example.educational_app.repository.UserRepository;
import com.example.educational_app.service.AttemptService;
import com.example.educational_app.utils.KeycloakUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/attempts")
public class AttemptController {

    @Autowired
    private AttemptService attemptService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AttemptRepository userAttemptRepository;

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
    @GetMapping("/leaderboard/course/{courseId}")
    @PreAuthorize("hasRole('Teacher')")
    public ResponseEntity<List<UserLeaderboard>> getLeaderboardByCourse(@PathVariable Long courseId) {
        List<UserLeaderboard> leaderboard = attemptService.getLeaderboardForCourse(courseId);
        return ResponseEntity.ok(leaderboard);
    }

    @GetMapping("/{quizId}/can-attempt")
    @PreAuthorize("hasRole('Student')")
    public ResponseEntity<Boolean> canAttemptQuiz(@PathVariable Long quizId) {
        String keycloakId = KeycloakUtil.getKeycloakIdFromToken();
        User user = userRepository.findByKeycloakId(keycloakId);

        List<UserAttempt> attempts = userAttemptRepository.findByUserId(user.getId());
        boolean canAttempt = attempts.stream().noneMatch(a -> a.getQuiz().getId().equals(quizId));

        return ResponseEntity.ok(canAttempt);
    }



}
