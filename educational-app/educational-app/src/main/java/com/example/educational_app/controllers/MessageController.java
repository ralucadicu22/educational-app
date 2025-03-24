package com.example.educational_app.controllers;

import com.example.educational_app.entities.Message;
import com.example.educational_app.entities.User;
import com.example.educational_app.repository.UserRepository;
import com.example.educational_app.service.MessageService;
import com.example.educational_app.utils.KeycloakUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @Autowired
    private UserRepository userRepository;
    @PostMapping("/send")
    public ResponseEntity<Message> sendMessage(
            @RequestParam Long recipientId,
            @RequestBody String content
    ) {
        Long senderId = getUserIdFromJWT();
        Message msg = messageService.sendMessage(senderId, recipientId, content);
        return ResponseEntity.ok(msg);
    }

    @GetMapping("/inbox")
    public List<Message> getInbox() {
        Long userId = getUserIdFromJWT();
        return messageService.getInbox(userId);
    }

    @GetMapping("/unread-count")
    public long getUnreadCount() {
        Long userId = getUserIdFromJWT();
        return messageService.getUnreadCount(userId);
    }

    @PutMapping("/{messageId}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long messageId) {
        messageService.markAsRead(messageId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/conversation/{otherUserId}")
    public List<Message> getConversation(@PathVariable Long otherUserId) {
        Long currentUserId = getUserIdFromJWT();
        return messageService.getConversation(currentUserId, otherUserId);
    }

    private Long getUserIdFromJWT() {
        String keycloakId = KeycloakUtil.getKeycloakIdFromToken();
        if (keycloakId == null) {
            throw new RuntimeException("No user in context (JWT missing?).");
        }
        User user = userRepository.findByKeycloakId(keycloakId);
        if (user == null) {
            throw new RuntimeException("User not found in DB");
        }
        return user.getId();
    }
}
