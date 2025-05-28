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
            const response = await fetch(
                `http://localhost:8081/courses/${courseId}/generate-code`,
                {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (response.ok) {
                const newCode = await response.text();
                setJoinCode(newCode);
                setMessage("✅ Join code generated!");
            } else {
                setMessage("❌ Error generating join code.");
            }
        } catch (err) {
            console.error("Error:", err);
            setMessage("❌ Error generating join code.");
        }
    };

    return (
        <div className="container my-5" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <h2 className="fw-bold text-purple mb-4 text-center">🔑 Generate Join Code</h2>

            <div
                className="card p-4 shadow-sm mx-auto"
                style={{
                    maxWidth: "600px",
                    borderRadius: "20px",
                    backgroundColor: "#fffaf4",
                    border: "1px solid #e3d7f3",
                }}
            >
                <p className="fw-semibold mb-3 text-center fs-5">
                    Current Join Code:
                    <span className="d-block text-purple fs-4 mt-1 fw-bold">
                        {joinCode || "No code generated yet."}
                    </span>
                </p>

                <div className="text-center">
                    <button
                        onClick={generateJoinCode}
                        className="btn fw-semibold px-4 py-2"
                        style={{
                            backgroundColor: "#6f42c1",
                            color: "#fff",
                            borderRadius: "10px",
                            boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                        }}
                    >
                        🔄 Generate New Code
                    </button>
                </div>

                {message && (
                    <div
                        className={`alert mt-4 text-center ${
                            message.startsWith("✅") ? "alert-success" : "alert-danger"
                        }`}
                        style={{ borderRadius: "12px" }}
                    >
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}

export default GenerateCodePage;
