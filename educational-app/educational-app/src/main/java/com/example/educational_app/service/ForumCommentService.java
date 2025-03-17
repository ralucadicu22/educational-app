package com.example.educational_app.service;

import com.example.educational_app.entities.ForumComment;
import com.example.educational_app.repository.ForumCommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ForumCommentService {
    @Autowired
    private ForumCommentRepository forumCommentRepository;

    public List<ForumComment> getCommentsForPost(Long postId) {
        return forumCommentRepository.findByPostId(postId);
    }

    public ForumComment createComment(ForumComment comment) {
        return forumCommentRepository.save(comment);
    }
    public ForumComment createReply(Long parentCommentId, ForumComment reply) {
        ForumComment parentComment = forumCommentRepository.findById(parentCommentId)
                .orElseThrow(() -> new RuntimeException("Parent comment not found"));

        reply.setParentComment(parentComment);
        reply.setPost(parentComment.getPost());
        return forumCommentRepository.save(reply);
    }

    public List<ForumComment> getReplies(Long parentCommentId) {
        return forumCommentRepository.findByParentCommentId(parentCommentId);
    }
    public List<ForumComment> getTopLevelCommentsForPost(Long postId) {
        return forumCommentRepository.findByPostIdAndParentCommentIsNull(postId);
    }
}
