import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";


function SendMessageForm({ recipientId, onMessageSent }) {
    const { token } = useContext(AuthContext);
    const [content, setContent] = useState("");

    const handleSend = () => {
        if (!content.trim()) return;
        fetch(`http://localhost:8081/messages/send?recipientId=${recipientId}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(content),
        })
            .then((res) => res.json())
            .then((data) => {
                setContent("");
                if (onMessageSent) onMessageSent(data);
            })
            .catch((err) => console.error("Error sending message:", err));
    };

    return (
        <div className="my-3">
  <textarea
      className="form-control mb-2"
      placeholder="Type your message..."
      value={content}
      onChange={(e) => setContent(e.target.value)}
      style={{ borderRadius: "12px", minHeight: "80px" }}
  />
            <button
                className="btn fw-semibold"
                style={{ backgroundColor: "#6f42c1", color: "#fff", borderRadius: "12px" }}
                onClick={handleSend}
            >
                📤 Send
            </button>
        </div>
    );
}

export default SendMessageForm;