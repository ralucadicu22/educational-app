package com.example.educational_app.service;

import com.example.educational_app.entities.Message;
import com.example.educational_app.entities.User;
import com.example.educational_app.repository.MessageRepository;
import com.example.educational_app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageService {
    @Autowired
    private MessageRepository messageRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private FollowService followService;

    public Message sendMessage(Long senderId, Long recipientId, String content) {
        if (!followService.isFollowing(senderId, recipientId)) {
            throw new RuntimeException("You must follow this user to send a message.");
        }

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User recipient = userRepository.findById(recipientId)
                .orElseThrow(() -> new RuntimeException("Recipient not found"));

        Message msg = new Message();
        msg.setSender(sender);
        msg.setRecipient(recipient);
        msg.setContent(content);
        msg.setSentTime(LocalDateTime.now());
        msg.setRead(false);

        return messageRepository.save(msg);
    }

    public List<Message> getInbox(Long userId) {
        return messageRepository.findByRecipientIdOrderBySentTimeDesc(userId);
    }

    public long getUnreadCount(Long userId) {
        return messageRepository.countByRecipientIdAndIsReadFalse(userId);
    }

    public void markAsRead(Long messageId) {
        Message msg = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        msg.setRead(true);
        messageRepository.save(msg);
    }
    public List<Message> getConversation(Long currentUserId, Long otherUserId) {
        return messageRepository.findConversation(currentUserId, otherUserId);
    }
}
