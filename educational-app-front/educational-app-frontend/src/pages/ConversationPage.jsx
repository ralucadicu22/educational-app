import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
function ConversationPage() {
    const { otherUserId } = useParams();
    const { user, token } = useContext(AuthContext);

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [otherUser, setOtherUser] = useState(null);
    useEffect(() => {
        if (!otherUserId) return;

        fetch(`http://localhost:8081/users/${otherUserId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => setOtherUser(data))
            .catch((err) => console.error("Error fetching other user:", err));
    }, [otherUserId, token]);

    useEffect(() => {
        if (!otherUserId) return;

        fetch(`http://localhost:8081/messages/conversation/${otherUserId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => setMessages(data))
            .catch((err) => console.error("Error fetching conversation:", err));
    }, [otherUserId, token]);

    const handleSend = () => {
        if (!newMessage.trim()) return;
        fetch(`http://localhost:8081/messages/send?recipientId=${otherUserId}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newMessage),
        })
            .then((res) => res.json())
            .then((msg) => {
                setMessages((prev) => [...prev, msg]);
                setNewMessage("");
            })
            .catch((err) => console.error("Error sending message:", err));
    };

    return (
        <div className="container mt-4">
            <h2 className="fw-bold mb-4">
                Conversation with{" "}
                {otherUser?.username ? otherUser.username : `User ${otherUserId}`}
            </h2>
            <div
                className="p-3 mb-3"
                style={{
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    maxHeight: "400px",
                    overflowY: "auto",
                    backgroundColor: "#f8f9fa",
                }}
            >
                {messages.length === 0 && (
                    <p className="text-muted">No messages yet. Say hi!</p>
                )}
                {messages.map((m) => {
                    const isMine = m.sender.id === user.id;

                    return (
                        <div key={m.id} className="mb-3">
                            <div className="fw-bold" style={{ fontSize: "0.9rem" }}>
                                {m.sender.username}:
                            </div>
                            <div
                                className="p-2"
                                style={{
                                    backgroundColor: isMine ? "#d1ecf1" : "#ffffff",
                                    borderRadius: "5px",
                                    display: "inline-block",
                                }}
                            >
                                {m.content}
                            </div>
                            <div className="text-muted" style={{ fontSize: "0.8rem" }}>
                                {new Date(m.sentTime).toLocaleString()}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="input-group">
        <textarea
            className="form-control"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
        />
                <button className="btn btn-primary" onClick={handleSend}>
                    Send
                </button>
            </div>
        </div>
    );
}

export default ConversationPage;
