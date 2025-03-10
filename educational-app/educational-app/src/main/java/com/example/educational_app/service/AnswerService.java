package com.example.educational_app.service;

import com.example.educational_app.entities.Answer;
import com.example.educational_app.entities.Question;
import com.example.educational_app.repository.AnswerRepository;
import com.example.educational_app.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnswerService {

    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private QuestionRepository questionRepository;

    public Answer createAnswer(Answer answer) {
        return answerRepository.save(answer);
    }

    public List<Answer> getCorrectAnswersForQuestion(Long questionId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        return answerRepository.findByQuestionAndCorrect(question, true);
    }
    public List<Answer> getAnswersForQuestion(Long questionId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        return answerRepository.findByQuestion(question);
    }


}
