package com.example.educational_app.service;

import com.example.educational_app.entities.CommentReactions;
import com.example.educational_app.entities.ForumComment;
import com.example.educational_app.entities.User;
import com.example.educational_app.repository.CommentReactionsRepository;
import com.example.educational_app.repository.ForumCommentRepository;
import com.example.educational_app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CommentReactionsService {
    @Autowired
    private CommentReactionsRepository commentReactionRepository;
    @Autowired
    private ForumCommentRepository forumCommentRepository;
    @Autowired
    private UserRepository userRepository;

    public void reactToComment(Long commentId, Long userId, CommentReactions.ReactionType reactionType) {
        ForumComment comment = forumCommentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<CommentReactions> existingReaction = commentReactionRepository.findByCommentAndUser(comment, user);

        if (existingReaction.isPresent()) {
            CommentReactions reaction = existingReaction.get();
            if (reaction.getReactionType() == reactionType) {
                commentReactionRepository.delete(reaction);
            } else {
                reaction.setReactionType(reactionType);
                commentReactionRepository.save(reaction);
            }
        } else {
            CommentReactions newReaction = new CommentReactions();
            newReaction.setComment(comment);
            newReaction.setUser(user);
            newReaction.setReactionType(reactionType);
            commentReactionRepository.save(newReaction);
        }
    }

    public long countLikes(Long commentId) {
        return commentReactionRepository.countByCommentIdAndReactionType(commentId, CommentReactions.ReactionType.LIKE);
    }

    public long countDislikes(Long commentId) {
        return commentReactionRepository.countByCommentIdAndReactionType(commentId, CommentReactions.ReactionType.DISLIKE);
    }
}
