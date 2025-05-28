import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useParams } from "react-router-dom";

function UploadFilePage() {
    const { token } = useContext(AuthContext);
    const { courseId } = useParams();

    const [selectedWeek, setSelectedWeek] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [videoTitle, setVideoTitle] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [message, setMessage] = useState("");

    const handleUploadFile = async () => {
        if (!selectedFile || !selectedWeek) {
            setMessage("⚠️ Please select a file and a valid week.");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("weekNumber", selectedWeek);
        formData.append("courseId", courseId);

        try {
            const response = await fetch(`http://localhost:8081/course-files/upload`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (response.ok) {
                setMessage("✅ File uploaded successfully!");
                setSelectedFile(null);
            } else {
                setMessage("❌ Error uploading file.");
            }
        } catch (err) {
            console.error("Error uploading file:", err);
            setMessage("❌ Error uploading file.");
        }
    };

    const handleUploadVideo = async () => {
        if (!videoUrl || !selectedWeek) {
            setMessage("⚠️ Please enter video URL and select a valid week.");
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8081/course-files/add-video?courseId=${courseId}&title=${encodeURIComponent(
                    videoTitle || "Untitled Video"
                )}&videoUrl=${encodeURIComponent(videoUrl)}&weekNumber=${selectedWeek}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                setMessage("✅ YouTube video uploaded successfully!");
                setVideoTitle("");
                setVideoUrl("");
            } else {
                setMessage("❌ Error uploading YouTube video.");
            }
        } catch (err) {
            console.error("Error uploading video:", err);
            setMessage("❌ Error uploading video.");
        }
    };

    return (
        <div
            className="container py-5"
            style={{
                fontFamily: "'Poppins', sans-serif",
                color: "#333",
                maxWidth: "800px",
            }}
        >
            <div className="text-center mb-4">
                <h1 className="fw-bold">📁 Upload Course Materials</h1>
                <hr style={{ width: "100px", borderTop: "3px solid #6f42c1", margin: "0 auto" }} />
            </div>

            <div className="mb-4">
                <label className="form-label fw-semibold">Select Week:</label>
                <select
                    className="form-select"
                    value={selectedWeek}
                    onChange={(e) => setSelectedWeek(e.target.value)}
                >
                    <option value="">-- Choose Week --</option>
                    {[...Array(12)].map((_, i) => (
                        <option key={i} value={i + 1}>
                            Week {i + 1}
                        </option>
                    ))}
                </select>
            </div>

            <div
                className="card p-4 mb-4 shadow-sm"
                style={{ borderRadius: "16px", backgroundColor: "#fffaf4" }}
            >
                <h5 className="mb-3 fw-semibold">📄 Upload File</h5>
                <input
                    type="file"
                    className="form-control mb-3"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                />
                <button
                    className="btn w-100 text-white fw-semibold"
                    style={{ backgroundColor: "#6f42c1", borderRadius: "10px" }}
                    onClick={handleUploadFile}
                >
                    Upload File
                </button>
            </div>

            <div
                className="card p-4 shadow-sm"
                style={{ borderRadius: "16px", backgroundColor: "#fffaf4" }}
            >
                <h2 className="mb-3 fw-semibold">▶️ Upload YouTube Video</h2>
                <input
                    type="text"
                    placeholder="Video Title"
                    className="form-control mb-2"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Video URL"
                    className="form-control mb-3"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                />
                <button
                    className="btn w-100 fw-semibold"
                    style={{
                        backgroundColor: "#fff",
                        color: "#6f42c1",
                        border: "2px solid #6f42c1",
                        borderRadius: "10px",
                    }}
                    onClick={handleUploadVideo}
                >
                    Upload Video
                </button>
            </div>

            {message && (
                <div
                    className="alert mt-4 text-center shadow-sm"
                    style={{
                        borderRadius: "12px",
                        backgroundColor: message.includes("✅")
                            ? "#e6ffe6"
                            : "#fff0f0",
                        color: message.includes("✅") ? "#2e7d32" : "#c62828",
                        fontWeight: "500",
                    }}
                >
                    {message}
                </div>
            )}
        </div>
    );
}

export default UploadFilePage;
