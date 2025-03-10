package com.example.educational_app.service;

import com.example.educational_app.entities.Question;
import com.example.educational_app.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionService {
    @Autowired
    private QuestionRepository questionRepository;

    public Question createQuestion(Question question) {
        return questionRepository.save(question);
    }

    public List<Question> getQuestionsForQuiz(Long quizId) {
        return questionRepository.findByQuizId(quizId);
    }
}
