package com.example.educational_app.controllers;

import com.example.educational_app.entities.CommentReactions;
import com.example.educational_app.entities.ForumComment;
import com.example.educational_app.service.CommentReactionsService;
import com.example.educational_app.service.ForumCommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/forum/comments")
public class ForumCommentController {
    @Autowired
    private ForumCommentService forumCommentService;

    @Autowired
    private CommentReactionsService commentReactionService;

    @GetMapping("/{postId}")
    public List<ForumComment> getCommentsForPost(@PathVariable Long postId) {
        return forumCommentService.getCommentsForPost(postId);
    }


    @PostMapping
    public ResponseEntity<ForumComment> createComment(@RequestBody ForumComment comment) {
        ForumComment savedComment = forumCommentService.createComment(comment);
        return new ResponseEntity<>(savedComment, HttpStatus.CREATED);
    }


    @PostMapping("/{commentId}/like/{userId}")
    public ResponseEntity<?> likeComment(@PathVariable Long commentId, @PathVariable Long userId) {
        commentReactionService.reactToComment(commentId, userId, CommentReactions.ReactionType.LIKE);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{commentId}/dislike/{userId}")
    public ResponseEntity<?> dislikeComment(@PathVariable Long commentId, @PathVariable Long userId) {
        commentReactionService.reactToComment(commentId, userId, CommentReactions.ReactionType.DISLIKE);
        return ResponseEntity.ok().build();
    }


    @GetMapping("/{commentId}/likes-count")
    public ResponseEntity<Long> getLikesCount(@PathVariable Long commentId) {
        return ResponseEntity.ok(commentReactionService.countLikes(commentId));
    }

    @GetMapping("/{commentId}/dislikes-count")
    public ResponseEntity<Long> getDislikesCount(@PathVariable Long commentId) {
        return ResponseEntity.ok(commentReactionService.countDislikes(commentId));
    }
    @PostMapping("/reply/{parentCommentId}")
    public ResponseEntity<ForumComment> createReply(@PathVariable Long parentCommentId, @RequestBody ForumComment reply) {
        ForumComment savedReply = forumCommentService.createReply(parentCommentId, reply);
        return new ResponseEntity<>(savedReply, HttpStatus.CREATED);
    }

    @GetMapping("/replies/{parentCommentId}")
    public ResponseEntity<List<ForumComment>> getReplies(@PathVariable Long parentCommentId) {
        return ResponseEntity.ok(forumCommentService.getReplies(parentCommentId));
    }
    @GetMapping("/top-level/{postId}")
    public List<ForumComment> getTopLevelComments(@PathVariable Long postId) {
        return forumCommentService.getTopLevelCommentsForPost(postId);
    }
}
