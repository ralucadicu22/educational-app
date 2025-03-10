package com.example.educational_app.repository;

import com.example.educational_app.entities.UserAttempt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttemptRepository extends JpaRepository<UserAttempt, Long> {
    List<UserAttempt> findByUserId(Long userId);
    List<UserAttempt> findByQuizId(Long quizId);
}
