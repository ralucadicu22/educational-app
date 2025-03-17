import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useParams } from "react-router-dom";

function GenerateCodePage() {
    const { token } = useContext(AuthContext);
    const { courseId } = useParams();
    const [joinCode, setJoinCode] = useState("");
    const [message, setMessage] = useState("");

    const generateJoinCode = async () => {
        try {
            const response = await fetch(`http://localhost:8081/courses/${courseId}/generate-code`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const newCode = await response.text();
                setJoinCode(newCode);
            } else {
                setMessage("Error generating join code.");
            }
        } catch (err) {
            console.error("Error:", err);
            setMessage("Error generating join code.");
        }
    };

    return (
        <div className="container mt-4">
            <h2>🔑 Generate Join Code</h2>
            <p>Current Join Code: <strong>{joinCode || "No code generated yet."}</strong></p>
            <button onClick={generateJoinCode} className="btn btn-warning">Generate New Code</button>
            {message && <p className="text-danger mt-3">{message}</p>}
        </div>
    );
}

export default GenerateCodePage;
