import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
function Navbar() {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    const userId = localStorage.getItem("userId");

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                <Link className="navbar-brand" to="/">EduPlatform</Link>

                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/courses">📚 Courses</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/forum">💬 Forum</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/users">🔍 Find Users</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/messages">✉️ Messages</Link>
                        </li>
                        {userId ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to={`/users/${userId}`}>👤 My Profile</Link>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-danger" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">🔑 Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">✍️ Register</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
