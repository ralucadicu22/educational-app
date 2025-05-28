import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/RegisterPage.css";

function RegisterPage() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        role: "Student",
    });
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        document.body.classList.toggle("dark-mode", darkMode);
        return () => {
            document.body.classList.remove("dark-mode");
        };
    }, [darkMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRegister = async () => {
        setError(null);
        try {
            const response = await fetch("http://localhost:8081/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Registration failed");

            alert("✅ Registration successful! You can now log in.");
            navigate("/login");
        } catch (err) {
            setError("❌ Registration failed. Try again.");
        }
    };

    return (
        <div className="register-container">
            <button className="theme-toggle-btn" onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
            </button>

            <div className="register-card">
                <h1 className="register-title">📝 Create Account</h1>

                <input
                    type="text"
                    name="username"
                    placeholder="👤 Username"
                    className="register-input"
                    onChange={handleChange}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="📧 Email"
                    className="register-input"
                    onChange={handleChange}
                />

                <div className="register-password-wrapper">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="🔒 Password"
                        className="register-input"
                        onChange={handleChange}
                    />
                    <span
                        className="toggle-password"
                        onClick={() => setShowPassword((prev) => !prev)}
                        title={showPassword ? "Hide password" : "Show password"}
                    >
            {showPassword ? "👁️" : "👁"}
          </span>
                </div>

                <select name="role" className="register-input" onChange={handleChange}>
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher</option>
                </select>

                {error && <div className="register-error">{error}</div>}

                <button className="register-btn" onClick={handleRegister}>
                    style={{
                    backgroundColor: "#5a1a8a",
                    color: "#ffffff",
                    border: "1px solid #47126e",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    fontWeight: 600,
                }}
                    REGISTER
                </button>

                <p className="register-login">
                    Already have an account?{" "}
                    <span onClick={() => navigate("/login")}>Log in</span>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;
