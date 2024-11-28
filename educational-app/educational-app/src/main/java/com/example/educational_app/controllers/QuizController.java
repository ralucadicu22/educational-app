package com.example.educational_app.controllers;

import com.example.educational_app.entities.Quiz;
import com.example.educational_app.repository.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/quizzes")
public class QuizController {
    @Autowired
    private QuizRepository quizRepository;
    @PostMapping("/addQuizz")
    public Quiz createQuiz(@RequestBody Quiz quiz){
        return quizRepository.save(quiz);
    }
    @GetMapping
    public List<Quiz> getQuizzes(){
        return quizRepository.findAll();
    }
}
