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
            setMessage("Please select a file and a valid week.");
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
                setMessage("File uploaded successfully!");
                setSelectedFile(null);
            } else {
                setMessage("Error uploading file.");
            }
        } catch (err) {
            console.error("Error uploading file:", err);
            setMessage("Error uploading file.");
        }
    };

    const handleUploadVideo = async () => {
        if (!videoUrl || !selectedWeek) {
            setMessage("Please enter video URL and select a valid week.");
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8081/course-files/add-video?courseId=${courseId}&title=${encodeURIComponent(videoTitle || "Untitled Video")}&videoUrl=${encodeURIComponent(videoUrl)}&weekNumber=${selectedWeek}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                setMessage("YouTube video uploaded successfully!");
                setVideoTitle("");
                setVideoUrl("");
            } else {
                setMessage("Error uploading YouTube video.");
            }
        } catch (err) {
            console.error("Error uploading video:", err);
            setMessage("Error uploading video.");
        }
    };

    return (
        <div className="container mt-4">
            <h2>📁 Upload Course Materials</h2>

            <div className="mb-3">
                <label>Select Week:</label>
                <select value={selectedWeek} onChange={(e) => setSelectedWeek(e.target.value)}>
                    <option value="">-- Choose Week --</option>
                    {[...Array(12)].map((_, i) => (
                        <option key={i} value={i + 1}>Week {i + 1}</option>
                    ))}
                </select>
            </div>

            <div className="mb-3">
                <h5>Upload File</h5>
                <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
                <button className="btn btn-primary ms-2" onClick={handleUploadFile}>
                    Upload File
                </button>
            </div>

            <div className="mb-3">
                <h5>Upload YouTube Video</h5>
                <input type="text" value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} placeholder="Video Title" className="form-control w-50 mb-2" />
                <input type="text" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="Video URL" className="form-control w-50 mb-2" />
                <button className="btn btn-primary" onClick={handleUploadVideo}>Upload Video</button>
            </div>

            {message && <p className="text-success mt-3">{message}</p>}
        </div>
    );
}

export default UploadFilePage;
