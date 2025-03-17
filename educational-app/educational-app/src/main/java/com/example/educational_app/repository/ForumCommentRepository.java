package com.example.educational_app.repository;

import com.example.educational_app.entities.ForumComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ForumCommentRepository extends JpaRepository<ForumComment,Long> {
    List<ForumComment> findByPostId(Long postId);
    List<ForumComment> findByParentCommentId(Long parentCommentId);
    List<ForumComment> findByPostIdAndParentCommentIsNull(Long postId);


}
