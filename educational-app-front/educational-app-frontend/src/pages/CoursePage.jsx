import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

function CoursesPage() {
    const { token, role } = useContext(AuthContext);
    const [courses, setCourses] = useState([]);
    const [newCourseName, setNewCourseName] = useState("");
    const [newCourseDescription, setNewCourseDescription] = useState("");
    const [joinCode, setJoinCode] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (!token) return;
        fetchCourses();
    }, [token, role]);

    const fetchCourses = () => {
        const endpoint =
            role === "Student"
                ? "http://localhost:8081/courses/my-enrolled"
                : "http://localhost:8081/courses/my-created";

        fetch(endpoint, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => setCourses(data))
            .catch((err) => console.error("Error fetching courses:", err));
    };

    const handleCreateCourse = async () => {
        if (!newCourseName || !newCourseDescription) {
            setMessage("⚠️ Name and description are required.");
            return;
        }
        try {
            const response = await fetch("http://localhost:8081/courses/add", {
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
            if (response.ok) {
                fetchCourses();
                setMessage("Course created successfully!");
                setNewCourseName("");
                setNewCourseDescription("");
            } else {
                const errorText = await response.text();
                setMessage(" Failed to create course: " + errorText);
            }
        } catch (err) {
            setMessage("Error: " + err.message);
        }
    };

    const handleJoinCourse = async () => {
        if (!joinCode) {
            setMessage("Enter a join code.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8081/courses/join?joinCode=${joinCode}`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });

            const result = await response.text();
            setMessage(result);

            if (response.ok) {
                fetchCourses();
                setJoinCode("");
            }
        } catch (err) {
            setMessage("Error: " + err.message);
        }
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="fw-bold">
                    {role === "Student" ? "📚 My Courses" : "📖 Courses I Teach"}
                </h1>
                <button className="btn btn-info btn-lg" onClick={() => navigate("/forum")}>
                    💬 Open to stay updated about community discussions
                </button>
            </div>

            {message && (
                <div
                    className={`alert ${
                        message.includes("✅") ? "alert-success" : "alert-danger"
                    } text-center`}
                >
                    {message}
                </div>
            )}

            <div className="row">
                {role === "Student" && (
                    <div className="col-md-6">
                        <div className="card p-4 mb-4 shadow-sm border-success">
                            <h3 className="mb-3 text-success">Join a Course</h3>
                            <div className="input-group">
                                <input
                                    type="text"
                                    placeholder="Enter join code..."
                                    value={joinCode}
                                    onChange={(e) => setJoinCode(e.target.value)}
                                    className="form-control"
                                />
                                <button onClick={handleJoinCourse} className="btn btn-success">
                                    Join
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {role === "Teacher" && (
                    <div className="col-md-6">
                        <div className="card p-4 mb-4 shadow-sm border-primary">
                            <h3 className="mb-3 text-primary">Create a New Course</h3>
                            <input
                                type="text"
                                placeholder="Course Name"
                                value={newCourseName}
                                onChange={(e) => setNewCourseName(e.target.value)}
                                className="form-control mb-2"
                            />
                            <textarea
                                placeholder="Course Description"
                                value={newCourseDescription}
                                onChange={(e) => setNewCourseDescription(e.target.value)}
                                className="form-control mb-2"
                            />
                            <button onClick={handleCreateCourse} className="btn btn-primary w-100">
                                Add Course
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <h3 className="mt-4 mb-3">
                {role === "Student" ? "🎓 Enrolled Courses" : "📋 My Courses"}
            </h3>

            {courses.length === 0 ? (
                <p className="text-muted text-center">No courses available.</p>
            ) : (
                <div className="row">
                    {courses.map((course) => (
                        <div key={course.id} className="col-md-6 col-lg-4">
                            <div
                                className="card course-card mb-3 shadow-sm border-dark"
                                style={{ cursor: "pointer", transition: "0.3s" }}
                                onClick={() => navigate(`/courses/${course.id}`)}
                                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                            >
                                <div className="card-body">
                                    <h5 className="card-title">{course.name}</h5>
                                    <p className="card-text text-muted">{course.description}</p>
                                    <button className="btn btn-outline-dark w-100">View Course</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CoursesPage;
