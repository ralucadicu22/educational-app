import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState(null);
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
            setError("Invalid username or password");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card p-4 shadow" style={{ width: "350px" }}>
                <h2 className="text-center mb-3">🔐 Login</h2>

                <input type="text" name="username" placeholder="Username" className="form-control mb-3" onChange={handleChange} />
                <input type="password" name="password" placeholder="Password" className="form-control mb-3" onChange={handleChange} />

                {error && <p className="text-danger text-center">{error}</p>}

                <button className="btn btn-primary w-100" onClick={handleLogin}>
                    LOGIN
                </button>

                <p className="text-center mt-3">
                    Don't have an account?{" "}
                    <span className="text-primary" style={{ cursor: "pointer" }} onClick={() => navigate("/register")}>
                        Register
                    </span>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
