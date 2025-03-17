import { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
    const [formData, setFormData] = useState({ username: "", email: "", password: "", role: "Student" });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card p-4 shadow" style={{ width: "350px" }}>
                <h2 className="text-center mb-3">📝 Register</h2>

                <input type="text" name="username" placeholder="Username" className="form-control mb-3" onChange={handleChange} />
                <input type="email" name="email" placeholder="Email" className="form-control mb-3" onChange={handleChange} />
                <input type="password" name="password" placeholder="Password" className="form-control mb-3" onChange={handleChange} />

                <select name="role" className="form-control mb-3" onChange={handleChange}>
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher</option>
                </select>

                {error && <p className="text-danger text-center">{error}</p>}

                <button className="btn btn-primary w-100" onClick={handleRegister}>
                    REGISTER
                </button>

                <p className="text-center mt-3">
                    Already have an account?{" "}
                    <span className="text-primary" style={{ cursor: "pointer" }} onClick={() => navigate("/login")}>
                        Log in
                    </span>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;
