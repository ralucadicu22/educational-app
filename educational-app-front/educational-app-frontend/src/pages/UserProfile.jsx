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
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setMutualFriends(data))
            .catch(err => console.error("Error fetching mutual friends", err));
    }, [profileUser, user, token]);

    useEffect(() => {
        if (!profileUser) return;

        fetch(`http://localhost:8081/courses/by-user/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setUserCourses(data))
            .catch(err => console.error("Error fetching user courses", err));
    }, [profileUser, id, token]);

    const handleInterestChange = (selectedInterest) => {
        setInterests(prev =>
            prev.includes(selectedInterest)
                ? prev.filter(i => i !== selectedInterest)
                : [...prev, selectedInterest]
        );
    };

    const saveInterests = () => {
        fetch(`http://localhost:8081/users/${id}/update-subjects`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(interests)
        })
            .then(res => res.json())
            .then(updatedUser => {
                setProfileUser(updatedUser);
                alert("Interests updated successfully!");
            })
            .catch(err => console.error(err));
    };

    const handleMessageSent = () => {
        setShowMessageForm(false);
        alert("Message sent!");
    };

    if (!profileUser) return <div className="text-center mt-5">Loading profile...</div>;

    return (
        <div className="container mt-5">

            {/* Header */}
            <div className="text-center mb-4">
                <h1 className="fw-bold">{profileUser.username}'s Profile</h1>
                <p className="text-muted">{profileUser.email}</p>

                {!isMyProfile && (
                    <div className="mb-3">
                        {following.includes(profileUser.id) ? (
                            <button
                                className="btn btn-danger me-2"
                                onClick={() => unfollowUser(profileUser.id)}
                            >
                                Unfollow
                            </button>
                        ) : (
                            <button
                                className="btn btn-primary me-2"
                                onClick={() => followUser(profileUser.id)}
                            >
                                Follow
                            </button>
                        )}

                        <button
                            className="btn btn-info"
                            onClick={() => setShowMessageForm(!showMessageForm)}
                        >
                            Message
                        </button>
                    </div>
                )}

                {showMessageForm && (
                    <div className="card p-3 mt-3">
                        <h5>Send a Message to {profileUser.username}</h5>
                        <SendMessageForm
                            recipientId={profileUser.id}
                            onMessageSent={handleMessageSent}
                        />
                    </div>
                )}
            </div>

            <div className="card p-4 mb-4 shadow-sm">
                <h3 className="fw-bold">📊 Statistics</h3>
                <ul className="list-group">
                    {profileUser.role !== "Teacher" && (
                        <>
                            <li className="list-group-item">
                                ✅ Quizzes Completed: {quizStats.completed}
                            </li>
                            <li className="list-group-item">
                                📈 Average Score: {quizStats.averageScore}
                            </li>
                        </>
                    )}
                    <li className="list-group-item">
                        🗣️ Forum Posts: {profileUser.forumPosts || 0}
                    </li>
                    <li className="list-group-item">
                        🫂 Followers: {profileUser.followersCount || 0}
                    </li>
                </ul>
            </div>

            <div className="card p-4 mb-4 shadow-sm">
                <h3 className="fw-bold">🎯 Interests</h3>
                {isMyProfile ? (
                    <>
                        <div className="mb-3">
                            {availableInterests.map(interest => (
                                <label key={interest} className="me-3">
                                    <input
                                        type="checkbox"
                                        checked={interests.includes(interest)}
                                        onChange={() => handleInterestChange(interest)}
                                    />{" "}
                                    {interest}
                                </label>
                            ))}
                        </div>
                        <button className="btn btn-success" onClick={saveInterests}>
                            Save Interests
                        </button>
                    </>
                ) : (
                    <p className="text-muted">
                        {profileUser.favoriteSubjects?.length
                            ? profileUser.favoriteSubjects.join(", ")
                            : "No interests added."
                        }
                    </p>
                )}
            </div>

            <div className="card p-4 mb-4 shadow-sm">
                <h3 className="fw-bold">👥 Friends</h3>
                {mutualFriends.length > 0 ? (
                    <ul className="list-group">
                        {mutualFriends.map(friend => (
                            <li key={friend.id} className="list-group-item">{friend.username}</li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-muted">No mutual friends.</p>
                )}
            </div>

            <div className="card p-4 mb-4 shadow-sm">
                <h3 className="fw-bold">
                    {profileUser.role === "Teacher"
                        ? "📖 Courses Taught"
                        : "📚 Enrolled Courses"}
                </h3>
                {userCourses.length === 0 ? (
                    <p className="text-muted">No courses found.</p>
                ) : (
                    <ul className="list-group">
                        {userCourses.map(course => (
                            <li key={course.id} className="list-group-item">
                                {course.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default UserProfile;
