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
            .catch(console.error);
    }, [otherUserId, token]);

    useEffect(() => {
        fetch(`http://localhost:8081/messages/conversation/${otherUserId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => setMessages(data))
            .catch(console.error);
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
            .catch(console.error);
    };

    return (
        <div className="container my-5" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <h1 className="text-center fw-bold mb-4" style={{ color: "#2c2c2c" }}>
                Conversation with {otherUser?.username || `User ${otherUserId}`}
            </h1>

            <div
                className="p-4 mb-4 rounded"
                style={{
                    backgroundColor: "#f9f6f0",
                    border: "1px solid #e0d4f7",
                    maxHeight: 400,
                    overflowY: "auto",
                    borderRadius: "16px",
                }}
            >
                {messages.length === 0 && <p className="text-muted">No messages yet. Say hi! 👋</p>}

                {messages.map((m) => {
                    const isMine = m.sender.id === user.id;
                    return (
                        <div key={m.id} className="mb-3 d-flex flex-column align-items-start">
                            <div
                                className="p-3 shadow-sm"
                                style={{
                                    backgroundColor: isMine ? "#dcd3f2" : "#fff",
                                    borderRadius: "12px",
                                    maxWidth: "80%",
                                    alignSelf: isMine ? "flex-end" : "flex-start",
                                }}
                            >
                                <div className="fw-semibold mb-1">{m.sender.username}</div>
                                <div>{m.content}</div>
                            </div>
                            <div className="text-muted small mt-1">
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
        style={{ borderRadius: "12px" }}
    />
                <button className="btn btn-purple fw-semibold" onClick={handleSend}>
                    📤 Send
                </button>
            </div>
        </div>
    );

}

export default ConversationPage;