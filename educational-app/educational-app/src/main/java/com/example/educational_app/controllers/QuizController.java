package com.example.educational_app.controllers;

import com.example.educational_app.entities.Quiz;
import com.example.educational_app.entities.Question;
import com.example.educational_app.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/quizzes")
public class QuizController {

    @Autowired
    private QuizService quizService;

    @PostMapping("/create")
    @PreAuthorize("hasAnyRole('Teacher','Student')")
    public ResponseEntity<Quiz> createQuiz(@RequestBody Quiz quiz) {

        Quiz createdQuiz = quizService.createQuiz(
                quiz.getCourse().getId(),
                quiz.getTitle(),
                quiz.getContent(),
                quiz.getTime(),
                quiz.getWeekNumber(),
                quiz.getQuestions()
        );

        return ResponseEntity.ok(createdQuiz);
    }

    @GetMapping
    public ResponseEntity<List<Quiz>> getAllQuizzes() {
        return ResponseEntity.ok(quizService.getAllQuizzes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Quiz> getQuizById(@PathVariable Long id) {
        return ResponseEntity.ok(quizService.getQuizById(id));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Quiz>> getQuizzesByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(quizService.getQuizzesByCourse(courseId));
    }
}
