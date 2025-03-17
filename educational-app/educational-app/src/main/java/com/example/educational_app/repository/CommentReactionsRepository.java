package com.example.educational_app.repository;

import com.example.educational_app.entities.CommentReactions;
import com.example.educational_app.entities.ForumComment;
import com.example.educational_app.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CommentReactionsRepository extends JpaRepository<CommentReactions, Long> {
    Optional<CommentReactions> findByCommentAndUser(ForumComment comment, User user);
    long countByCommentIdAndReactionType(Long commentId, CommentReactions.ReactionType reactionType);
}
