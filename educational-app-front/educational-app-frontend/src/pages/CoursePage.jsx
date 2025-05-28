import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useCourseRecommendations } from "../hooks/userRecommendationsCourse";

function CoursesPage() {
    const { token, role } = useContext(AuthContext);
    const [courses, setCourses] = useState([]);
    const [newCourseName, setNewCourseName] = useState("");
    const [newCourseDescription, setNewCourseDescription] = useState("");
    const [joinCode, setJoinCode] = useState("");
    const [message, setMessage] = useState("");
    const [darkMode, setDarkMode] = useState(
        () => localStorage.getItem("darkMode") === "true"
    );
    const [showRecs, setShowRecs] = useState(false);

    const navigate = useNavigate();
    const { recs, loading: recsLoading, refreshRecs } =
        useCourseRecommendations();

    useEffect(() => {
        document.body.style.backgroundColor = darkMode ? "#1e1e1e" : "#fefaf6";
        fetchCourses();
    }, [token, role, darkMode]);

    const fetchCourses = () => {
        if (!token) return;
        const endpoint =
            role === "Student"
                ? "http://localhost:8081/courses/my-enrolled"
                : "http://localhost:8081/courses/my-created";
        fetch(endpoint, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then(setCourses)
            .catch(console.error);
    };

    const handleCreateCourse = async () => {
        if (!newCourseName || !newCourseDescription) {
            setMessage("⚠️ Name and description are required.");
            return;
        }
        const res = await fetch("http://localhost:8081/courses/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                name: newCourseName,
                description: newCourseDescription,
            }),
        });
        const txt = await res.text();
        setMessage(txt);
        if (res.ok) {
            setNewCourseName("");
            setNewCourseDescription("");
            fetchCourses();
        }
    };

    const handleJoinCourse = async () => {
        if (!joinCode) {
            setMessage("⚠️ Enter a join code.");
            return;
        }
        const res = await fetch(
            `http://localhost:8081/courses/join?joinCode=${joinCode}`,
            {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        const txt = await res.text();
        setMessage(txt);
        if (res.ok) {
            setJoinCode("");
            fetchCourses();
        }
    };

    const handleToggleRecs = () => {
        setShowRecs((v) => !v);
        if (!showRecs) refreshRecs();
    };

    return (
        <div
            className="container py-5"
            style={{
                fontFamily: "'Poppins', sans-serif",
                color: darkMode ? "#fff" : "#333",
            }}
        >

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="fw-bold">
                    {role === "Student" ? "📚 My Courses" : "📖 Courses I Teach"}
                </h1>
            </div>

            {role === "Student" && (
                <div className="col-md-6 mb-4 p-0">
                    <div
                        className="p-4"
                        style={{
                            backgroundColor: darkMode ? "#2c2c2c" : "#fffaf4",
                            border: "1px solid #6f42c1",
                            borderRadius: "16px",
                        }}
                    >
                        <h2 style={{ color: "#6f42c1" }}>Join a Course</h2>
                        <div className="d-flex">
                            <input
                                type="text"
                                value={joinCode}
                                onChange={(e) => setJoinCode(e.target.value)}
                                placeholder="Enter join code..."
                                className="form-control me-2"
                                style={{ borderRadius: "10px" }}
                            />
                            <button
                                className="btn"
                                style={{
                                    backgroundColor: "#6f42c1",
                                    color: "#fff",
                                    borderRadius: "10px",
                                }}
                                onClick={handleJoinCourse}
                            >
                                Join
                            </button>
                        </div>
                        {message && (
                            <div className="mt-3" style={{ color: darkMode ? "#f88" : "#d00" }}>
                                {message}
                            </div>
                        )}
                    </div>
                </div>
            )}


            {role === "Teacher" && (
                <div className="col-md-6 mb-4 p-0">
                    <div
                        className="p-4"
                        style={{
                            backgroundColor: darkMode ? "#2c2c2c" : "#fffaf4",
                            border: "1px solid #6f42c1",
                            borderRadius: "16px",
                        }}
                    >
                        <h2 style={{ color: "#6f42c1" }}>Create a New Course</h2>
                        <input
                            type="text"
                            value={newCourseName}
                            onChange={(e) => setNewCourseName(e.target.value)}
                            placeholder="Course Name"
                            className="form-control mb-2"
                            style={{ borderRadius: "10px" }}
                        />
                        <textarea
                            value={newCourseDescription}
                            onChange={(e) => setNewCourseDescription(e.target.value)}
                            placeholder="Course Description"
                            className="form-control mb-3"
                            style={{ borderRadius: "10px" }}
                        />
                        <button
                            className="btn"
                            style={{
                                backgroundColor: "#6f42c1",
                                color: "#fff",
                                borderRadius: "10px",
                            }}
                            onClick={handleCreateCourse}
                        >
                            Add Course
                        </button>
                        {message && (
                            <div className="mt-3" style={{ color: darkMode ? "#f88" : "#d00" }}>
                                {message}
                            </div>
                        )}
                    </div>
                </div>
            )}


            <h4 className="mt-4 mb-3 fw-semibold">
                {role === "Student" ? "🎓 Enrolled Courses" : "📋 My Courses"}
            </h4>
            {courses.length === 0 ? (
                <p className="text-muted">No courses available.</p>
            ) : (
                <div className="row">
                    {courses.map((course) => (
                        <div className="col-md-6 col-lg-4 mb-4" key={course.id}>
                            <div
                                className="p-3"
                                style={{
                                    backgroundColor: darkMode ? "#2a2a2a" : "#ffffff",
                                    border: "1px solid #6f42c1",
                                    borderRadius: "16px",
                                    cursor: "pointer",
                                }}
                            >
                                <h5 style={{ color: "#6f42c1" }}>{course.name}</h5>
                                <p className="text-muted">{course.description}</p>
                                <button
                                    className="btn btn-sm w-100"
                                    style={{
                                        backgroundColor: "#6f42c1",
                                        color: "#fff",
                                        borderRadius: "8px",
                                    }}
                                    onClick={() => navigate(`/courses/${course.id}`)}
                                >
                                    View Course
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}


            {role === "Student" && (
                <div className="mb-3">
                    <button
                        className="btn"
                        onClick={handleToggleRecs}
                        style={{

                            color: "#6f42c1",
                            borderRadius: "10px",
                            padding: "8px 16px",
                        }}
                    >
                        {showRecs ? "Hide Course Suggestions" : "Show Course Suggestions...."}
                    </button>
                </div>
            )}

            {/* Suggestions as plain list */}
            {showRecs && (
                         <div className="mb-4" style={{ maxWidth: "600px" }}>
                               <h5>Suggested Courses:</h5>
                              {recsLoading && <p>Loading…</p>}
                               {!recsLoading && recs.length === 0 && (
                                 <p className="text-muted">No suggestions at the moment.</p>
                              )}
                                {!recsLoading && recs.length > 0 && (
                                 <ul className="list-unstyled" style={{ paddingLeft: 0 }}>
                                       {recs.map((title, idx) => (
                                         <li key={idx} style={{ margin: "0.5rem 0", lineHeight: 1 }}>
                                               {title.trim()}
                                             </li>
                                      ))}
                                     </ul>
                             )}
                             </div>
                     )}
        </div>
    );
}

export default CoursesPage;
