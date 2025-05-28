import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useParams, useNavigate } from "react-router-dom";

function CourseDetailsPage() {
    const { token, role, user } = useContext(AuthContext);
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [files, setFiles] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [error, setError] = useState(null);

    const handleDownload = async (fileId, fileName) => {
        try {
            const response = await fetch(`http://localhost:8081/course-files/download/${fileId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
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

    const handleStartQuiz = (quizId) => {
        const docElm = document.documentElement;
        const requestFullScreenPromise =
            docElm.requestFullscreen?.() ||
            docElm.mozRequestFullScreen?.() ||
            docElm.webkitRequestFullscreen?.() ||
            docElm.msRequestFullscreen?.() ||
            Promise.resolve();

        requestFullScreenPromise
            .then(() => navigate(`/quizzes/${quizId}`))
            .catch(() => navigate(`/quizzes/${quizId}`));
    };

    useEffect(() => {
        if (!courseId) return setError("Course ID is missing!");

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
            .catch((err) => setError(err.message));

        fetch(`http://localhost:8081/quizzes/course/${courseId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then(async (data) => {
                const withAttemptStatus = await Promise.all(
                    data.map(async (quiz) => {
                        try {
                            const res = await fetch(`http://localhost:8081/attempts/${quiz.id}/can-attempt`, {
                                headers: { Authorization: `Bearer ${token}` },
                            });
                            const canAttempt = await res.json();
                            return { ...quiz, canAttempt };
                        } catch (err) {
                            console.error("Error checking attempt status", err);
                            return { ...quiz, canAttempt: false };
                        }
                    })
                );
                setQuizzes(withAttemptStatus);
            })
            .catch((err) => setError(err.message));
    }, [courseId, token]);

    const groupedContent = [...files, ...quizzes].reduce((acc, item) => {
        const week = `Week ${item.weekNumber || "Other"}`;
        acc[week] = acc[week] || [];
        acc[week].push(item);
        return acc;
    }, {});

    if (error) return <div className="alert alert-danger mt-4">Error: {error}</div>;
    if (!course) return <p className="text-center mt-4">Loading course...</p>;

    return (
        <div className="container my-5" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <div className="row">
                <div className="col-md-3 mb-4">
                    <div
                        className="p-3 shadow-sm rounded"
                        style={{ backgroundColor: "#fefaf6", border: "1px solid #e0dfff" }}
                    >
                        <h5 className="fw-semibold mb-3" style={{ color: "#6f42c1" }}>
                            🔎 Quick Jump
                        </h5>
                        <ul className="list-unstyled small">
                            {Object.keys(groupedContent).map((week, idx) => (
                                <li key={idx} className="mb-2">
                                    <a href={`#${week.replace(/\s/g, "").toLowerCase()}`} style={{ color: "#6f42c1", textDecoration: "none" }}>
                                        📘 {week}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="col-md-9">
                    <h1 className="fw-bold text-purple">{course.name}</h1>

                    <p className="text-muted fst-italic">{course.description}</p>

                    {role === "Teacher" && (
                        <div className="d-flex flex-wrap gap-2 mb-4">
                            <button
                                className="btn btn-sm text-white fw-semibold"
                                style={{ backgroundColor: "#6f42c1" }}
                                onClick={() => navigate(`/courses/${courseId}/edit`)}
                            >
                                ✏️ Edit Course
                            </button>


                            <button className="btn btn-sm text-white fw-semibold" style={{ backgroundColor: "#6f42c1" }} onClick={() => navigate(`/quizzes/create?courseId=${courseId}`)}>
                                ➕ Create Quiz
                            </button>
                            <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(`/attempts/leaderboard/course/${courseId}`)}>
                                🏆 View Leaderboard
                            </button>
                            <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(`/course-files/${courseId}/upload`)}>
                                📁 Upload File
                            </button>
                            <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(`/courses/${courseId}/generate-code`)}>
                                🔑 Generate Join Code
                            </button>
                        </div>
                    )}

                    {role === "Student" && (
                        <div className="mb-4">
                            <button className="btn btn-sm text-white fw-semibold" style={{ backgroundColor: "#6f42c1" }} onClick={() => navigate(`/attempts/user/${localStorage.getItem("userId")}`)}>
                                📊 View My Quiz Progress
                            </button>
                        </div>
                    )}

                    {Object.entries(groupedContent).map(([week, items], idx) => (
                        <div key={idx} className="mb-5" id={week.replace(/\s/g, "").toLowerCase()}>
                            <h2 className="fw-bold text-dark mb-3 border-bottom pb-1" style={{ color: "#6f42c1" }}>
                                📘 {week}
                            </h2>

                            <div className="d-flex flex-column gap-4">
                                {items.map((item, i) => (
                                    <div key={i} className="card shadow-sm p-3">
                                        {"fileUrl" in item ? (
                                            item.fileType === "youtube" ? (
                                                <div className="ratio ratio-16x9">
                                                    <iframe
                                                        loading="lazy"
                                                        referrerPolicy="strict-origin-when-cross-origin"
                                                      src={item.fileUrl
                                                        .replace("https://www.youtube.com/watch?v=", "https://www.youtube-nocookie.com/embed/")
                                                       .replace("watch?v=", "embed/")}
                                                    title={item.fileName}
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    className="rounded"
                                                    ></iframe>
                                                </div>
                                            ) : (
                                                <button
                                                    className="btn btn-sm text-white fw-semibold"
                                                    style={{ backgroundColor: "#6f42c1" }}
                                                    onClick={() => handleDownload(item.id, item.fileName)}
                                                >
                                                    📄 Download {item.fileName}
                                                </button>
                                            )
                                        ) : (
                                            <>
                                                <strong className="mb-1 d-block">{item.title}</strong>
                                                <p className="text-muted">{item.content}</p>

                                                <div className="d-flex gap-2 flex-wrap">
                                                    {role === "Teacher" && (
                                                        <button
                                                            className="btn btn-sm text-white fw-semibold"
                                                            style={{ backgroundColor: "#6f42c1" }}
                                                            onClick={() => navigate(`/quizzes/${item.id}/edit`)}
                                                        >
                                                            ✏️ Edit Quiz
                                                        </button>
                                                    )}

                                                    {role === "Student" && (
                                                        item.canAttempt ? (
                                                            <button
                                                                className="btn btn-sm text-white fw-semibold"
                                                                style={{ backgroundColor: "#6f42c1" }}
                                                                onClick={() => handleStartQuiz(item.id)}
                                                            >
                                                                📝 Start Quiz
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="btn btn-sm btn-secondary"
                                                                disabled
                                                                title="You have already completed this quiz."
                                                            >
                                                                ✅ Quiz Completed
                                                            </button>
                                                        )
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
}

export default CourseDetailsPage;
