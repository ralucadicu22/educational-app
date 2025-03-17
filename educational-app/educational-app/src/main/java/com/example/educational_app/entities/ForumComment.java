package com.example.educational_app.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "forum_comments")
public class ForumComment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne
    @JoinColumn(name = "post_id")
    @JsonBackReference(value = "post-comments")
    private ForumPost post;

    @ManyToOne
    @JoinColumn(name = "author_id")
    private User author;

    private String content;

    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;
    @ManyToOne
    @JoinColumn(name = "parent_comment_id")
    @JsonBackReference(value = "comment-replies")
    private ForumComment parentComment;

    @OneToMany(mappedBy = "parentComment", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference(value = "comment-replies")
    private List<ForumComment> replies = new ArrayList<>();

    public ForumPost getPost() {
        return post;
    }

    public void setPost(ForumPost post) {
        this.post = post;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<ForumComment> getReplies() {
        return replies;
    }

    public void setReplies(List<ForumComment> replies) {
        this.replies = replies;
    }

    public ForumComment getParentComment() {
        return parentComment;
    }

    public void setParentComment(ForumComment parentComment) {
        this.parentComment = parentComment;
    }
}

