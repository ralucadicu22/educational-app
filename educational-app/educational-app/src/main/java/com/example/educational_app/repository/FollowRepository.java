package com.example.educational_app.repository;

import com.example.educational_app.entities.Follow;
import com.example.educational_app.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FollowRepository extends JpaRepository<Follow, Long> {

    boolean existsByFollowerAndFollowing(User follower, User following);
    List<Follow> findByFollowing(User user);
    List<Follow> findByFollower(User user);
    Optional<Follow> findByFollowerAndFollowing(User follower, User following);
    @Query("SELECT f.following FROM Follow f WHERE f.follower = :user")
    List<User> findFollowingByUser(User user);
    @Query("SELECT f.follower FROM Follow f WHERE f.following = :user")
    List<User> findFollowersByUser(User user);
}
