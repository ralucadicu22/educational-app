package com.example.educational_app.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.List;

@Entity
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String text;

    @JsonBackReference("quiz-questions")
    @ManyToOne
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;

      @JsonManagedReference("question-answers")
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Answer> answers;
    public Question() {}

    public Question(String text, Quiz quiz, List<Answer> answers) {
        this.text = text;
        this.quiz = quiz;
        this.answers = answers;
    }

    public void setAnswers(List<Answer> answers) {
        this.answers = answers;
        for (Answer a : answers) {
            a.setQuestion(this);
        }
    }

    public Quiz getQuiz() {
        return quiz;
    }

    public void setQuiz(Quiz quiz) {
        this.quiz = quiz;
    }

    public List<Answer> getAnswers() { return answers; }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
