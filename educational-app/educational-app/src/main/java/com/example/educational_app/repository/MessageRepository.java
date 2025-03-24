package com.example.educational_app.repository;

import com.example.educational_app.entities.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByRecipientIdOrderBySentTimeDesc(Long recipientId);
    long countByRecipientIdAndIsReadFalse(Long recipientId);
    @Query("SELECT m FROM Message m " +
            "WHERE (m.sender.id = :userA AND m.recipient.id = :userB) " +
            "   OR (m.sender.id = :userB AND m.recipient.id = :userA) " +
            "ORDER BY m.sentTime ASC")
    List<Message> findConversation(@Param("userA") Long userA, @Param("userB") Long userB);


}
