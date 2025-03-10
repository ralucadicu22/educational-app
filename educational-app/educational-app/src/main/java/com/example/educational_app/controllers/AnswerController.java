package com.example.educational_app.controllers;

import com.example.educational_app.entities.Answer;
import com.example.educational_app.repository.AnswerRepository;
import com.example.educational_app.service.AnswerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/answers")
public class AnswerController {

    @Autowired
    private AnswerService answerService;
    @Autowired
    private AnswerRepository answerRepository;

    @PostMapping("/create")
    public ResponseEntity<Answer> createAnswer(@RequestBody Answer answer) {
        Answer savedAnswer = answerService.createAnswer(answer);
        return ResponseEntity.ok(savedAnswer);
    }

    @GetMapping("/question/{questionId}")
    public ResponseEntity<List<Answer>> getAnswersForQuestion(@PathVariable Long questionId) {
        List<Answer> answers = answerService.getAnswersForQuestion(questionId);
        return ResponseEntity.ok(answers);
    }

    @GetMapping("/question/{questionId}/correct")
    public ResponseEntity<List<Answer>> getCorrectAnswersForQuestion(@PathVariable Long questionId) {
        List<Answer> correctAnswers = answerService.getCorrectAnswersForQuestion(questionId);
        return ResponseEntity.ok(correctAnswers);
    }
    @PutMapping("/update/{answerId}")
    public ResponseEntity<Answer> updateAnswer(@PathVariable Long answerId, @RequestBody Answer updatedAnswer) {
        Answer existingAnswer = answerRepository.findById(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found"));

        existingAnswer.setText(updatedAnswer.getText());
        existingAnswer.setCorrect(updatedAnswer.isCorrect());


        Answer savedAnswer = answerRepository.save(existingAnswer);
        return ResponseEntity.ok(savedAnswer);
    }



}
