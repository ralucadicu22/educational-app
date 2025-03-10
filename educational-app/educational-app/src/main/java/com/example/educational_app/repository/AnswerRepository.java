package com.example.educational_app.repository;

import com.example.educational_app.entities.Answer;
import com.example.educational_app.entities.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnswerRepository extends JpaRepository<Answer, Long> {

    List<Answer> findByQuestion(Question question);

    List<Answer> findByQuestionAndCorrect(Question question, boolean correct);
}
