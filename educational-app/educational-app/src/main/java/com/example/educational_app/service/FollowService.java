package com.example.educational_app.service;

import com.example.educational_app.entities.Follow;
import com.example.educational_app.entities.User;
import com.example.educational_app.repository.FollowRepository;
import com.example.educational_app.repository.UserRepository;
import com.example.educational_app.utils.KeycloakUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FollowService {
    @Autowired
    private FollowRepository followRepository;

    @Autowired
    private UserRepository userRepository;

    public void followUser(Long followingUserId) {
        String keycloakId = KeycloakUtil.getKeycloakIdFromToken();
        if(keycloakId == null) throw new RuntimeException("No user in context");

        User follower = userRepository.findByKeycloakId(keycloakId);
        if (follower == null) throw new RuntimeException("Follower not found in DB");

        User following = userRepository.findById(followingUserId)
                .orElseThrow(() -> new RuntimeException("Following user not found"));

        if (followRepository.existsByFollowerAndFollowing(follower, following)) {
            throw new RuntimeException("Already following this user");
        }

        Follow follow = new Follow();
        follow.setFollower(follower);
        follow.setFollowing(following);
        followRepository.save(follow);
    }

    public void unfollowUser(Long followingUserId) {
        String keycloakId = KeycloakUtil.getKeycloakIdFromToken();
        if(keycloakId == null) throw new RuntimeException("No user in context");

        User follower = userRepository.findByKeycloakId(keycloakId);
        if (follower == null) throw new RuntimeException("Follower not found in DB");

        User following = userRepository.findById(followingUserId)
                .orElseThrow(() -> new RuntimeException("Following user not found"));

        Optional<Follow> existingFollow = followRepository.findByFollowerAndFollowing(follower, following);
        if (existingFollow.isPresent()) {
            followRepository.delete(existingFollow.get());
        } else {
            throw new RuntimeException("Not following this user");
        }
    }
    public List<User> getMutualFriends(Long userId1, Long userId2) {
        User user1 = userRepository.findById(userId1)
                .orElseThrow(() -> new RuntimeException("User 1 not found"));
        User user2 = userRepository.findById(userId2)
                .orElseThrow(() -> new RuntimeException("User 2 not found"));

        List<User> user1Friends = followRepository.findFollowingByUser(user1);
        List<User> user2Friends = followRepository.findFollowingByUser(user2);

        return user1Friends.stream()
                .filter(user2Friends::contains)
                .collect(Collectors.toList());
    }
}
