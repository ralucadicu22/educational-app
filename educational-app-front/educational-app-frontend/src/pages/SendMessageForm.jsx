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
                alert("Message sent successfully!");
            })
            .catch((err) => console.error("Error sending message:", err));
    };

    return (
        <div className="my-3">
            <h5>Send a Message</h5>
            <textarea
                className="form-control mb-2"
                placeholder="Type your message..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handleSend}>
                Send
            </button>
        </div>
    );
}

export default SendMessageForm;
