import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { MessagesContext } from "../context/MessageContext";
import SendMessageForm from "./SendMessageForm";
import { useNavigate } from "react-router-dom";

function MessagesPage() {
    const { token } = useContext(AuthContext);
    const { fetchUnreadCount } = useContext(MessagesContext);
    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [openReplyMessageId, setOpenReplyMessageId] = useState(null);

    const fetchMessages = () => {
        fetch(`http://localhost:8081/messages/inbox?ts=${Date.now()}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => setMessages(data))
            .catch((err) => console.error("Error fetching messages:", err));
    };

    useEffect(() => {
        if (token) {
            fetchMessages();
        }
    }, [token]);

    const markAsRead = (messageId) => {
        fetch(`http://localhost:8081/messages/${messageId}/read`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(() => {
                setMessages(prev =>
                    prev.map(m => m.id === messageId ? { ...m, isRead: true } : m)
                );

                fetchUnreadCount();
            })
            .catch((err) => console.error("Error marking as read:", err));
    };


    const handleOpenReplyForm = (messageId) => {
        setOpenReplyMessageId((prev) => (prev === messageId ? null : messageId));
    };

    const goToConversation = (otherUserId) => {
        navigate(`/conversation/${otherUserId}`);
    };

    return (
        <div className="container my-5" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <h1 className="text-center fw-bold mb-4" style={{ color: "#6f42c1" }}>📥 My Inbox</h1>

            {messages.length === 0 ? (
                <p className="text-muted text-center">No messages found.</p>
            ) : (
                messages.map((msg) => (
                    <div
                        key={msg.id}
                        className="card mb-4 shadow-sm border-0"
                        style={{
                            borderRadius: "20px",
                            backgroundColor: msg.isRead ? "#fdfdfd" : "#f8f1ff",
                        }}
                    >
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h2 className="fw-bold text-dark m-0">✉️ {msg.sender?.username}</h2>
                                <small className="text-muted">
                                    {new Date(msg.sentTime).toLocaleString()}
                                </small>
                            </div>

                            <p className="mb-3" style={{ fontSize: "0.95rem" }}>{msg.content}</p>

                            <div className="d-flex flex-wrap gap-2">
                                {!msg.isRead && (
                                    <button
                                        className="btn btn-sm btn-outline-success fw-semibold"
                                        onClick={() => markAsRead(msg.id)}
                                    >
                                        ✅ Mark as Read
                                    </button>
                                )}
                                <button
                                    className="btn btn-sm btn-outline-primary fw-semibold"
                                    onClick={() => handleOpenReplyForm(msg.id)}
                                >
                                    🔁 Reply
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-dark fw-semibold"
                                    onClick={() => goToConversation(msg.sender?.id)}
                                >
                                    💬 View Conversation
                                </button>
                            </div>

                            {openReplyMessageId === msg.id && (
                                <div className="mt-3">
                                    <SendMessageForm
                                        recipientId={msg.sender?.id}
                                        onMessageSent={() => {
                                            setOpenReplyMessageId(null);
                                            fetchMessages();
                                        }}
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
