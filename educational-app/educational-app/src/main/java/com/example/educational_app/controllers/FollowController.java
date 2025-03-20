package com.example.educational_app.controllers;

import com.example.educational_app.entities.User;
import com.example.educational_app.service.FollowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/follows")
public class FollowController {

    @Autowired
    private FollowService followService;

    @PostMapping("/follow")
    public ResponseEntity<String> follow(@RequestParam Long userId) {
        followService.followUser(userId);
        return ResponseEntity.ok("Followed successfully!");
    }

    @DeleteMapping("/unfollow")
    public ResponseEntity<String> unfollow(@RequestParam Long userId) {
        followService.unfollowUser(userId);
        return ResponseEntity.ok("Unfollowed successfully!");
    }
    @GetMapping("/mutual-friends/{userId1}/{userId2}")
    public ResponseEntity<List<User>> getMutualFriends(@PathVariable Long userId1, @PathVariable Long userId2) {
        return ResponseEntity.ok(followService.getMutualFriends(userId1, userId2));
    }

}
