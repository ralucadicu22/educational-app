package com.example.educational_app.entities;

import java.util.Map;

public class UserLeaderboard {
    private Long userId;
    private String username;
    private Map<Long, Integer> quizScores;
    private int quizzesCompleted;
    private int totalScore;

    public UserLeaderboard(Long userId, String username, Map<Long, Integer> quizScores, int quizzesCompleted, int totalScore) {
        this.userId = userId;
        this.username = username;
        this.quizScores = quizScores;
        this.quizzesCompleted = quizzesCompleted;
        this.totalScore = totalScore;
    }


    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Map<Long, Integer> getQuizScores() {
        return quizScores;
    }

    public void setQuizScores(Map<Long, Integer> quizScores) {
        this.quizScores = quizScores;
    }

    public int getQuizzesCompleted() {
        return quizzesCompleted;
    }

    public void setQuizzesCompleted(int quizzesCompleted) {
        this.quizzesCompleted = quizzesCompleted;
    }

    public int getTotalScore() {
        return totalScore;
    }

    public void setTotalScore(int totalScore) {
        this.totalScore = totalScore;
    }
}
