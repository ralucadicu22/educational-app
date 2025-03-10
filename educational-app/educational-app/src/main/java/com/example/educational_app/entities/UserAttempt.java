
package com.example.educational_app.entities;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
public class UserAttempt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;

    private int score;
    private LocalDateTime attemptTime;

    @ElementCollection
    private List<Long> selectedAnswers;

    public UserAttempt() {}

    public UserAttempt(User user, Quiz quiz, int score, List<Long> selectedAnswers) {
        this.user = user;
        this.quiz = quiz;
        this.score = score;
        this.selectedAnswers = selectedAnswers;
        this.attemptTime = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Quiz getQuiz() { return quiz; }
    public void setQuiz(Quiz quiz) { this.quiz = quiz; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }

    public List<Long> getSelectedAnswers() { return selectedAnswers; }
    public void setSelectedAnswers(List<Long> selectedAnswers) { this.selectedAnswers = selectedAnswers; }

    public LocalDateTime getAttemptTime() { return attemptTime; }
}
