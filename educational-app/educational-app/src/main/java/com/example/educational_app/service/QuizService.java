package com.example.educational_app.service;

import com.example.educational_app.entities.*;
import com.example.educational_app.repository.*;
import com.example.educational_app.utils.KeycloakUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class QuizService {
    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private CoursesRepository coursesRepository;

    @Autowired
    private UserRepository userRepository;

    public Quiz createQuiz(Long courseId, String title, String content, int time, Integer weekNumber, List<Question> questions) {

        Courses course = coursesRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));


        Quiz quiz = new Quiz(title, content, time, course, weekNumber);


        if (questions != null) {
            for (Question q : questions) {

                System.out.println("Question text = " + q.getText());

                q.setQuiz(quiz);


                if (q.getAnswers() != null) {
                    for (Answer ans : q.getAnswers()) {
                        ans.setQuestion(q);
                    }
                }
            }
            quiz.setQuestions(questions);
        }


        return quizRepository.save(quiz);
    }

    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }

    public Quiz getQuizById(Long id) {
        return quizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
    }

    public List<Quiz> getQuizzesByCourse(Long courseId) {
        return quizRepository.findByCourseId(courseId);
    }
}
