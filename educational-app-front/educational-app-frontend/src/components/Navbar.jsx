import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthProvider";

function Navbar() {
    const navigate = useNavigate();
    const { logout, token } = useContext(AuthContext);
    const [unreadCount, setUnreadCount] = useState(0);

    const userId = localStorage.getItem("userId");
    useEffect(() => {
        if (!token || !userId) return;

        const fetchUnreadCount = () => {
            fetch("http://localhost:8081/messages/unread-count", {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then((res) => res.json())
                .then((count) => {
                    setUnreadCount(count);
                })
                .catch((err) => console.error("Error fetching unread count:", err));
        };

        fetchUnreadCount();
        const intervalId = setInterval(fetchUnreadCount, 30000);

        return () => clearInterval(intervalId);
    }, [token, userId]);
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
                            {/* 🔹 Link la /messages cu badge roșu dacă unreadCount > 0 */}
                            <Link className="nav-link" to="/messages">
                                ✉️ Messages
                                {unreadCount > 0 && (
                                    <span className="badge bg-danger ms-1">
                                        {unreadCount}
                                    </span>
                                )}
                            </Link>
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
