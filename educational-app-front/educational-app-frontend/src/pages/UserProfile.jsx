import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { FollowContext } from "../context/FollowContext";
import SendMessageForm from "./SendMessageForm";

const availableInterests = ["Java", "AI", "Web Development", "Databases", "Cyber Security"];

function UserProfile() {
    const { id } = useParams();
    const { user, token } = useContext(AuthContext);
    const { following, followUser, unfollowUser } = useContext(FollowContext);

    const [profileUser, setProfileUser] = useState(null);
    const [interests, setInterests] = useState([]);
    const [mutualFriends, setMutualFriends] = useState([]);
    const [quizStats, setQuizStats] = useState({ completed: 0, averageScore: "N/A" });
    const [userCourses, setUserCourses] = useState([]);
    const [showMessageForm, setShowMessageForm] = useState(false);

    const isMyProfile = user?.id === Number(id);
    const isFollowingThisProfile = following.includes(Number(id));

    useEffect(() => {
        fetch(`http://localhost:8081/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                setProfileUser(data);
                setInterests(data.favoriteSubjects || []);
            })
            .catch(console.error);
    }, [id, token]);

    useEffect(() => {
        if (!profileUser || profileUser.role === "Teacher") return;
        fetch(`http://localhost:8081/attempts/user/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((attempts) => {
                if (attempts.length === 0) return;
                const totalScore = attempts.reduce((sum, a) => sum + a.score, 0);
                const averageScore = (totalScore / attempts.length).toFixed(2);
                setQuizStats({ completed: attempts.length, averageScore });
            })
            .catch(console.error);
    }, [id, token, profileUser]);

    useEffect(() => {
        fetch(`http://localhost:8081/forum/posts`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((posts) => {
                const userPosts = posts.filter((post) => post.author.id === Number(id));
                setProfileUser((prev) => ({ ...prev, forumPosts: userPosts.length }));
            })
            .catch(console.error);
    }, [id, token]);

    useEffect(() => {
        if (!user || !profileUser) return;
        fetch(`http://localhost:8081/follows/mutual-friends/${user.id}/${profileUser.id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => setMutualFriends(data))
            .catch(console.error);
    }, [profileUser, user, token]);

    useEffect(() => {
        if (!profileUser) return;
        fetch(`http://localhost:8081/courses/by-user/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => setUserCourses(data))
            .catch(console.error);
    }, [profileUser, id, token]);

    const handleInterestChange = (interest) => {
        setInterests((prev) =>
            prev.includes(interest)
                ? prev.filter((i) => i !== interest)
                : [...prev, interest]
        );
    };

    const saveInterests = () => {
        fetch(`http://localhost:8081/users/${id}/update-subjects`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(interests),
        })
            .then((res) => res.json())
            .then((updatedUser) => {
                setProfileUser(updatedUser);
                alert("Interests updated successfully!");
            })
            .catch(console.error);
    };

    const handleMessageSent = () => {
        setShowMessageForm(false);
        alert("Message sent!");
    };

    if (!profileUser) return <div className="text-center mt-5">Loading profile...</div>;

    return (
        <div className="container py-5" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <div className="text-center mb-5">
                <h1 className="fw-bold" style={{ color: "#6f42c1" }}>{profileUser.username}'s Profile</h1>
                <p className="text-muted">{profileUser.email}</p>

                {!isMyProfile && (
                    <div className="mb-3">
                        {isFollowingThisProfile ? (
                            <>
                                <button
                                    className="btn btn-outline-danger me-2"
                                    onClick={() => unfollowUser(profileUser.id)}
                                >
                                    Unfollow
                                </button>
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => setShowMessageForm(!showMessageForm)}
                                >
                                    Message
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    className="btn btn-outline-primary me-2"
                                    onClick={() => followUser(profileUser.id)}
                                >
                                    Follow
                                </button>
                                <button className="btn btn-secondary" disabled>
                                    Message
                                </button>
                            </>
                        )}
                    </div>
                )}

                {showMessageForm && (
                    <div className="card p-3 mt-3 mx-auto shadow-sm" style={{ maxWidth: "500px" }}>
                        <h2 className="fw-semibold mb-2">Send a Message to {profileUser.username}</h2>
                        <SendMessageForm recipientId={profileUser.id} onMessageSent={handleMessageSent} />
                    </div>
                )}
            </div>

            <div className="row g-4">
                <div className="col-md-6">
                    <div className="card p-4 h-100 shadow-sm" style={{ borderRadius: "16px" }}>
                        <h3 className="fw-bold mb-3">📊 Stats</h3>
                        <ul className="list-group list-group-flush">
                            {profileUser.role !== "Teacher" && (
                                <>
                                    <li className="list-group-item">✅ Quizzes Completed: {quizStats.completed}</li>
                                    <li className="list-group-item">📈 Average Score: {quizStats.averageScore}</li>
                                </>
                            )}
                            <li className="list-group-item">🗣️ Forum Posts: {profileUser.forumPosts || 0}</li>
                            <li className="list-group-item">🫂 Followers: {profileUser.followersCount || 0}</li>
                        </ul>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card p-4 h-100 shadow-sm" style={{ borderRadius: "16px" }}>
                        <h4 className="fw-bold mb-3">🎯 Interests</h4>
                        {isMyProfile ? (
                            <>
                                <div className="mb-3">
                                    {availableInterests.map((interest) => (
                                        <label key={interest} className="me-3">
                                            <input
                                                type="checkbox"
                                                checked={interests.includes(interest)}
                                                onChange={() => handleInterestChange(interest)}
                                                className="form-check-input me-1"
                                            />
                                            {interest}
                                        </label>
                                    ))}
                                </div>
                                <button className="btn btn-success fw-semibold" onClick={saveInterests}>
                                    Save Interests
                                </button>
                            </>
                        ) : (
                            <p className="text-muted">
                                {profileUser.favoriteSubjects?.length
                                    ? profileUser.favoriteSubjects.join(", ")
                                    : "No interests added."}
                            </p>
                        )}
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card p-4 h-100 shadow-sm" style={{ borderRadius: "16px" }}>
                        <h5 className="fw-bold mb-3">👥 Friends</h5>
                        {mutualFriends.length > 0 ? (
                            <ul className="list-group">
                                {mutualFriends.map((friend) => (
                                    <li key={friend.id} className="list-group-item">
                                        {friend.username}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted">No mutual friends.</p>
                        )}
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card p-4 h-100 shadow-sm" style={{ borderRadius: "16px" }}>
                        <h6 className="fw-bold mb-3">
                            {profileUser.role === "Teacher" ? "📖 Courses Taught" : "📚 Enrolled Courses"}
                        </h6>
                        {userCourses.length === 0 ? (
                            <p className="text-muted">No courses found.</p>
                        ) : (
                            <ul className="list-group">
                                {userCourses.map((course) => (
                                    <li key={course.id} className="list-group-item">
                                        {course.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;
