package com.example.educational_app.service;

import com.example.educational_app.entities.ForumPost;
import com.example.educational_app.repository.ForumPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ForumPostService {
    @Autowired
    private ForumPostRepository forumPostRepository;

    public List<ForumPost> getAllPosts() {
        return forumPostRepository.findAll();
    }

    public ForumPost getPostById(Long id) {
        return forumPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
    }

    public ForumPost createPost(ForumPost post) {
        return forumPostRepository.save(post);
    }

    public void deletePost(Long id) {
        forumPostRepository.deleteById(id);
    }
}
