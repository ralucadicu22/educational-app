package com.example.educational_app.service;

import com.example.educational_app.entities.*;
import com.example.educational_app.repository.*;
import com.example.educational_app.utils.KeycloakUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AttemptService {

    @Autowired
    private AttemptRepository userAttemptRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private AnswerRepository answerRepository;

    public UserAttempt submitAttempt(Long quizId, List<Long> selectedAnswerIds) {
        String keycloakId = KeycloakUtil.getKeycloakIdFromToken();
        if (keycloakId == null) throw new RuntimeException("No user in context");

        User user = userRepository.findByKeycloakId(keycloakId);
        if (user == null) throw new RuntimeException("User not found in DB");

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        List<Question> questions = questionRepository.findByQuizId(quizId);

        int totalScore = 0;
        for (Question question : questions) {
            List<Answer> correctAnswers = answerRepository.findByQuestionAndCorrect(question, true);
            for (Answer correctAnswer : correctAnswers) {
                if (selectedAnswerIds.contains(correctAnswer.getId())) {
                    totalScore++;
                }
            }
        }
        UserAttempt attempt = new UserAttempt(user, quiz, totalScore, selectedAnswerIds);
        return userAttemptRepository.save(attempt);
    }

    public List<UserAttempt> getAttemptsByUser(Long userId) {
        return userAttemptRepository.findByUserId(userId);
    }

    public List<UserAttempt> getAttemptsByQuiz(Long quizId) {
        return userAttemptRepository.findByQuizId(quizId);
    }

    public UserAttempt saveAttempt(UserAttempt attempt) {
        return userAttemptRepository.save(attempt);
    }
}
