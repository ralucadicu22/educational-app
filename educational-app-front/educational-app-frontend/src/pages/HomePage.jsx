import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import "../css/HomePage.css";

function HomePage() {
    const { isAuthenticated, user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        document.body.classList.toggle("dark-mode", darkMode);
        return () => {
            document.body.classList.remove("dark-mode");
        };
    }, [darkMode]);

    return (
        <div className="homepage-container">
            <button className="theme-toggle-btn" onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
            </button>

            <div className="homepage-card">
                <h1 className="homepage-title">
                    {isAuthenticated ? `Welcome, ${user.username}! 🎉` : "EduPlatform"}
                </h1>

                <p className="homepage-subtitle">
                    {isAuthenticated
                        ? "Continue learning and exploring your courses."
                        : "Log in to access your personalized learning experience."}
                </p>

                {!isAuthenticated ? (
                    <>
                        <button className="homepage-btn login-btn" onClick={() => navigate("/login")}
                                style={{
                                    backgroundColor: "#5a1a8a",
                                    color: "#ffffff",
                                    border: "1px solid #47126e",
                                    padding: "10px 20px",
                                    borderRadius: "8px",
                                    fontWeight: 600,
                                }}>
                            🔑 Login
                        </button>
                        <button className="homepage-btn register-btn" onClick={() => navigate("/register")}
                                style={{
                                    backgroundColor: "#5a1a8a",
                                    color: "#ffffff",
                                    border: "1px solid #47126e",
                                    padding: "10px 20px",
                                    borderRadius: "8px",
                                    fontWeight: 600,
                                }}>
                            ✍️ Register
                        </button>
                    </>
                ) : (
                    <button className="homepage-btn logout-btn" onClick={logout}>
                        🚪 Logout
                    </button>
                )}
            </div>
        </div>
    );
}

export default HomePage;
