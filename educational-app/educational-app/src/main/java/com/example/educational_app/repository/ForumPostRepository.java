package com.example.educational_app.repository;

import com.example.educational_app.entities.ForumPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ForumPostRepository extends JpaRepository<ForumPost,Long> {
    List<ForumPost> findByCategory(String category);
}
