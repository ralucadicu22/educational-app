import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import SendMessageForm from "./SendMessageForm";
import { useNavigate } from "react-router-dom";

function MessagesPage() {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [openReplyMessageId, setOpenReplyMessageId] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8081/messages/inbox", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => setMessages(data))
            .catch(err => console.error("Error fetching messages:", err));
    }, [token]);

    const markAsRead = (messageId) => {
        fetch(`http://localhost:8081/messages/${messageId}/read`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(() => {
                setMessages(prev =>
                    prev.map(m => (m.id === messageId ? { ...m, isRead: true } : m))
                );
            })
            .catch(err => console.error("Error marking as read:", err));
    };

    const handleOpenReplyForm = (messageId) => {
        if (openReplyMessageId === messageId) {
            setOpenReplyMessageId(null);
        } else {
            setOpenReplyMessageId(messageId);
        }
    };

    const goToConversation = (otherUserId) => {
        navigate(`/conversation/${otherUserId}`);
    };

    return (
        <div className="container mt-4">
            <h2>My Inbox</h2>

            {messages.length === 0 ? (
                <p>No messages</p>
            ) : (
                messages.map((msg) => (
                    <div key={msg.id} className="card mb-3 shadow-sm">
                        <div className="card-body">
                            <p><strong>From:</strong> {msg.sender?.username}</p>
                            <p>{msg.content}</p>
                            <small className="text-muted">
                                {new Date(msg.sentTime).toLocaleString()}
                            </small>

                            <div className="mt-2">
                                {!msg.isRead && (
                                    <button
                                        className="btn btn-sm btn-outline-success me-2"
                                        onClick={() => markAsRead(msg.id)}
                                    >
                                        Mark as read
                                    </button>
                                )}

                                <button
                                    className="btn btn-sm btn-outline-primary me-2"
                                    onClick={() => handleOpenReplyForm(msg.id)}
                                >
                                    Reply
                                </button>

                                <button
                                    className="btn btn-sm btn-secondary"
                                    onClick={() => goToConversation(msg.sender?.id)}
                                >
                                    View Conversation
                                </button>
                            </div>

                            {openReplyMessageId === msg.id && (
                                <div className="mt-3">
                                    <SendMessageForm
                                        recipientId={msg.sender?.id}
                                        onMessageSent={() => setOpenReplyMessageId(null)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default MessagesPage;
