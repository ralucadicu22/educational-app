import { useState, useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import "../css/LoginPage.css";

function LoginPage() {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async () => {
        setError(null);
        try {
            const response = await fetch("http://localhost:8081/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Login failed");

            const data = await response.json();
            login(data.access_token);
            navigate("/courses");
        } catch (err) {
            setError("❌ Invalid username or password");
        }
    };

    useEffect(() => {
        document.body.classList.toggle("dark-mode", darkMode);
        return () => {
            document.body.classList.remove("dark-mode");
        };
    }, [darkMode]);

    return (
        <div className="loginpage-container">
            <button className="theme-toggle-btn" onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
            </button>

            <div className="loginpage-card">
                <h2 className="loginpage-title">🔐 Sign In to <span>EduPlatform</span></h2>

                <input
                    type="text"
                    name="username"
                    placeholder="👤 Username"
                    className="loginpage-input"
                    onChange={handleChange}
                />

                <div className="loginpage-password-wrapper">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="🔒 Password"
                        className="loginpage-input"
                        onChange={handleChange}
                    />
                    <span
                    className="toggle-password"
                    onClick={() => setShowPassword(prev => !prev)}
                    title={showPassword ? "Hide password" : "Show password"}
                >
               {showPassword ? "👁️" : "👁"}
         </span>
                </div>

                {error && <div className="loginpage-error">{error}</div>}
                <button
                    className="loginpage-btn"
                    onClick={handleLogin}
                    style={{
                        backgroundColor: "#5a1a8a",
                        color: "#ffffff",
                        border: "1px solid #47126e",
                        padding: "10px 20px",
                        borderRadius: "8px",
                        fontWeight: 600,
                    }}
                >
                    Login
                </button>
                <p className="loginpage-register">
                    Don't have an account?{" "}
                    <span onClick={() => navigate("/register")}>Register</span>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
