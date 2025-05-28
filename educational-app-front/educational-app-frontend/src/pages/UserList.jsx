import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { FollowContext } from "../context/FollowContext";
import { useNavigate } from "react-router-dom";

function UsersList() {
    const { token, user } = useContext(AuthContext);
    const { following, followUser, unfollowUser } = useContext(FollowContext);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) return;
        fetch("http://localhost:8081/users", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => setUsers(data))
            .catch((err) => console.error("Error fetching users:", err));
    }, [token]);

    const handleViewProfile = (selectedUserId) => {
        if (selectedUserId === user.id || following.includes(selectedUserId)) {
            navigate(`/users/${selectedUserId}`);
        } else {
            alert("You must follow this user first to see their profile!");
        }
    };

    const handleFollowToggle = async (id) => {
        if (following.includes(id)) {
            await unfollowUser(id);
        } else {
            await followUser(id);
        }
    };

    return (
        <div className="container py-5" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <h1 className="text-center fw-bold mb-4" style={{ color: "#2c2c2c" }}>👥 Members</h1>

            <div className="row g-4">
                {users.map((u) => {
                    const isMyself = u.id === user.id;
                    const isFollowing = following.includes(u.id);

                    return (
                        <div key={u.id} className="col-sm-6 col-md-4 col-lg-3">
                            <div
                                className="card h-100 shadow-sm border-0 text-center p-3"
                                style={{ borderRadius: "16px", backgroundColor: "#fefaf6" }}
                            >
                                <div
                                    style={{
                                        width: "80px",
                                        height: "80px",
                                        borderRadius: "50%",
                                        margin: "0 auto",
                                        backgroundColor: "#e0d4f7",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "1.5rem",
                                        fontWeight: "600",
                                        color: "#6f42c1",
                                    }}
                                >
                                    {u.username.charAt(0).toUpperCase()}
                                </div>

                                <h2 className="mt-3 fw-bold" style={{ color: "#6f42c1" }}>{u.username}</h2>
                                <p className="text-muted mb-2">{u.role}</p>

                                {!isMyself && (
                                    <button
                                        className="btn btn-sm w-100 mb-2 fw-semibold"
                                        style={{
                                            backgroundColor: isFollowing ? "#dcd3f2" : "#6f42c1",
                                            color: isFollowing ? "#6f42c1" : "#fff",
                                            borderRadius: "12px",
                                        }}
                                        onClick={() => handleFollowToggle(u.id)}
                                    >
                                        {isFollowing ? "Unfollow" : "Follow"}
                                    </button>
                                )}

                                <button
                                    className="btn btn-outline-secondary btn-sm w-100 fw-semibold"
                                    style={{ borderRadius: "12px" }}
                                    onClick={() => handleViewProfile(u.id)}
                                >
                                    View Profile
                                </button>
                            </div>
                        </div>
                    );
                })}

                {users.length === 0 && (
                    <div className="text-center mt-5">
                        <p className="text-muted">No users found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UsersList;