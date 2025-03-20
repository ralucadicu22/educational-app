import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function CourseDetailsPage() {
    const { token, role } = useContext(AuthContext);
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [files, setFiles] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [error, setError] = useState(null);
    const handleDownload = async (fileId, fileName) => {
        try {
            const response = await fetch(
                `http://localhost:8081/course-files/download/${fileId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (!response.ok) throw new Error("Download failed");
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (err) {
            console.error("Error downloading file:", err);
        }
    };
    useEffect(() => {
        if (!courseId) {
            setError("Course ID is missing!");
            return;
        }



        fetch(`http://localhost:8081/courses/${courseId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch course data");
                return res.json();
            })
            .then((data) => {
                setCourse(data);
                setFiles(data.files || []);
            })
            .catch((err) => {
                console.error("Error fetching course:", err);
                setError(err.message);
            });

        fetch(`http://localhost:8081/quizzes/course/${courseId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch quizzes");
                return res.json();
            })
            .then((data) => setQuizzes(data))
            .catch((err) => {
                console.error("Error fetching quizzes:", err);
                setError(err.message);
            });
    }, [courseId, token]);

    if (error) return <div className="alert alert-danger">Error: {error}</div>;
    if (!course) return <p>Loading course...</p>;


    return (
        <div className="container mt-4">
            <Navbar />
            <h1>{course.name}</h1>
            <p>{course.description}</p>
            {role === "Teacher" && (
                <div className="d-flex justify-content-around my-4">
                    <button className="btn btn-primary" onClick={() => navigate(`/quizzes/create?courseId=${courseId}`)}>
                        ➕ Create Quiz
                    </button>
                    <button className="btn btn-warning" onClick={() => navigate(`/attempts/leaderboard/course/${courseId}`)}>
                        🏆 View Leaderboard
                    </button>
                    <button className="btn btn-info" onClick={() => navigate(`/course-files/${courseId}/upload`)}>
                        📁 Upload File
                    </button>
                    <button className="btn btn-success" onClick={() => navigate(`/courses/${courseId}/generate-code`)}>
                        🔑 Generate Join Code
                    </button>
                </div>
            )}

            {role === "Student" && (
                <div className="text-center my-4">
                    <button
                        className="btn btn-outline-primary"
                        onClick={() => navigate(`/attempts/user/${localStorage.getItem("userId")}`)}
                    >
                        📊 View My Quiz Progress
                    </button>
                </div>
            )}

            <h4>📚 Course Content</h4>
            {files.length === 0 && quizzes.length === 0 ? (
                <p>No files or quizzes yet.</p>
            ) : (
                Object.entries(
                    [...files, ...quizzes].reduce((acc, item) => {
                        const week = `Week ${item.weekNumber || "Other"}`;
                        acc[week] = acc[week] || [];
                        acc[week].push(item);
                        return acc;
                    }, {})
                ).map(([week, items], idx) => (
                    <div key={idx} className="mb-4">
                        <h5>{week}</h5>
                        {items.map((item, i) => (
                            <div key={i} className="border p-2 mb-2">
                                {"fileUrl" in item ? (
                                    item.fileType === "youtube" ? (
                                        <iframe width="300" height="200" src={item.fileUrl.replace("watch?v=", "embed/")} title={item.fileName} allowFullScreen></iframe>
                                    ) : (
                                        <button className="btn btn-outline-primary" onClick={() => handleDownload(item.id, item.fileName)}>
                                            📄 Download {item.fileName}
                                        </button>
                                    )
                                ) : (
                                    <>
                                        <strong>{item.title}</strong> <br />
                                        {item.content}
                                        <button
                                            className="btn btn-sm btn-outline-success mt-1"
                                            onClick={() => navigate(`/quizzes/${item.id}`)}
                                        >
                                            Open Quiz
                                        </button>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                ))
            )}
        </div>
    );
}

export default CourseDetailsPage;
