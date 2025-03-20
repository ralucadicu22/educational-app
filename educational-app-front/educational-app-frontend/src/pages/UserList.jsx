import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { FollowContext } from "../context/FollowContext";
import { useNavigate } from "react-router-dom";

function UsersList() {
    const { token } = useContext(AuthContext);
    const { following, followUser, unfollowUser } = useContext(FollowContext);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:8081/users`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => setUsers(data))
            .catch((err) => console.error("Error fetching users", err));
    }, [token]);

    return (
        <div className="container mt-4">
            <h2 className="mb-4 text-center fw-bold">👥 All Users</h2>

            <div className="row">
                {users.map((u) => (
                    <div key={u.id} className="col-md-6 col-lg-4">
                        <div className="card mb-3 shadow-sm border-0">
                            <div className="card-body d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 className="fw-bold">{u.username}</h5>
                                </div>
                                <div>
                                    <button
                                        className={`btn btn-sm ${following.includes(u.id) ? "btn-danger" : "btn-primary"} me-2`}
                                        onClick={() => following.includes(u.id)
                                            ? unfollowUser(u.id)
                                            : followUser(u.id)
                                        }
                                    >
                                        {following.includes(u.id) ? "Unfollow" : "Follow"}
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() => navigate(`/users/${u.id}`)}
                                    >
                                        View Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UsersList;
