package com.example.educational_app.controllers;

import com.example.educational_app.entities.ForumPost;
import com.example.educational_app.service.ForumPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/forum/posts")
public class ForumPostController {
    @Autowired
    private ForumPostService forumPostService;

    @GetMapping
    public List<ForumPost> getAllPosts() {
        return forumPostService.getAllPosts();
    }

    @GetMapping("/{id}")
    public ForumPost getPostById(@PathVariable Long id) {
        return forumPostService.getPostById(id);
    }

    @PostMapping
    public ResponseEntity<ForumPost> createPost(@RequestBody ForumPost post) {
        ForumPost savedPost = forumPostService.createPost(post);
        return new ResponseEntity<>(savedPost, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id) {
        forumPostService.deletePost(id);
        return ResponseEntity.ok().build();
    }
}
