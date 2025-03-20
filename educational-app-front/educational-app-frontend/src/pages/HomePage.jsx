import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

function HomePage() {
    const { isAuthenticated, user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="text-center p-5 shadow-lg rounded bg-white" style={{ width: "400px" }}>
                <h1 className="mb-3">
                    {isAuthenticated ? `Welcome, ${user.username}! 🎉` : "Welcome to EduPlatform! 📚"}
                </h1>
                <p className="text-muted">
                    {isAuthenticated
                        ? "Continue learning and exploring your courses."
                        : "Log in to access your personalized learning experience."}
                </p>

                {!isAuthenticated ? (
                    <div>
                        <button className="btn btn-primary w-100 mb-2" onClick={() => navigate("/login")}>
                            🔑 Login
                        </button>
                        <button className="btn btn-outline-primary w-100" onClick={() => navigate("/register")}>
                            ✍️ Register
                        </button>
                    </div>
                ) : (
                    <button className="btn btn-danger w-100" onClick={logout}>
                        🚪 Logout
                    </button>
                )}

            </div>
        </div>
    );
}

export default HomePage;
