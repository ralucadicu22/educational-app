import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthProvider";
import { ThemeContext } from "../context/ThemeContext";
import { MessagesContext } from "../context/MessageContext";

function Navbar() {
    const navigate = useNavigate();
    const { logout, token } = useContext(AuthContext);
    const userId = localStorage.getItem("userId");
    const { darkMode, toggleDarkMode } = useContext(ThemeContext);
    const { unreadCount, fetchUnreadCount } = useContext(MessagesContext);

    useEffect(() => {
        if (token && userId) fetchUnreadCount();
    }, [token, userId, fetchUnreadCount]);

    useEffect(() => {
        document.body.classList.toggle("dark-mode", darkMode);
        localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const bgColor = darkMode ? "#111" : "#f5f0e8";
    const linkColor = darkMode ? "#ddd" : "#333";

    return (
        <nav
            className="navbar navbar-expand-lg shadow-sm px-4"
            style={{
                backgroundColor: bgColor,
                fontFamily: "'Poppins', sans-serif",
                borderBottom: darkMode ? "1px solid #444" : "1px solid #ccc",
            }}
        >
            <div className="container-fluid">
                <Link
                    className="navbar-brand fw-bold"
                    to="/"
                    style={{ color: "#6f42c1" }}
                >
                    EduPlatform
                </Link>

                <ul className="navbar-nav ms-auto d-flex align-items-center gap-2">
                    <li className="nav-item">
                        <Link
                            className="nav-link"
                            to="/courses"
                            style={{ color: linkColor }}
                        >
                            📘 Courses
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            className="nav-link"
                            to="/forum"
                            style={{ color: linkColor }}
                        >
                            💬 Forum
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            className="nav-link"
                            to="/users"
                            style={{ color: linkColor }}
                        >
                            🔍 Find Users
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            className="nav-link"
                            to="/messages"
                            style={{ color: linkColor }}
                        >
                            ✉️ Messages
                            {unreadCount > 0 && (
                                <span className="badge rounded-pill bg-danger ms-1">
                  {unreadCount}
                </span>
                            )}
                        </Link>
                    </li>

                    {userId ? (
                        <>
                            <li className="nav-item">
                                <Link
                                    className="nav-link"
                                    to={`/users/${userId}`}
                                    style={{ color: linkColor }}
                                >
                                    👤 Profile
                                </Link>
                            </li>
                            <li className="nav-item">
                                {/* use solid danger for better contrast */}
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className="btn btn-sm"
                                    onClick={toggleDarkMode}
                                    style={{
                                        backgroundColor: darkMode ? "#444" : "#e0dede",
                                        color: darkMode ? "#fff" : "#333",
                                        borderRadius: "10px",
                                        padding: "6px 14px",
                                    }}
                                >
                                    {darkMode ? "🌙 Dark" : "☀️ Light"}
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="nav-item">
                                <Link
                                    className="btn btn-sm btn-outline-secondary"
                                    to="/login"
                                >
                                    🔑 Login
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    className="btn btn-sm text-white"
                                    style={{ backgroundColor: "#6f42c1" }}
                                    to="/register"
                                >
                                    ✍️ Register
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
