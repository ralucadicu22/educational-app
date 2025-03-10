package com.example.educational_app.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "quiz")
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String content;
    private Integer time;

    private Integer weekNumber;

    @ManyToOne
    @JsonIgnoreProperties({"files","creator","enrolledStudents","joinCode"})
    private Courses course;

    @JsonManagedReference("quiz-questions")
    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Question> questions = new ArrayList<>();

    public Quiz() {
    }
    public Quiz(String title, String content, Integer time, Courses course, Integer weekNumber) {
        this.title = title;
        this.content = content;
        this.time = time;
        this.course = course;
        this.weekNumber = weekNumber;
    }


    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Integer getTime() { return time; }
    public void setTime(Integer time) { this.time = time; }

    public Integer getWeekNumber() { return weekNumber; }
    public void setWeekNumber(Integer weekNumber) { this.weekNumber = weekNumber; }

    public Courses getCourse() { return course; }
    public void setCourse(Courses course) { this.course = course; }

    public List<Question> getQuestions() { return questions; }
    public void setQuestions(List<Question> questions) { this.questions = questions; }
}
