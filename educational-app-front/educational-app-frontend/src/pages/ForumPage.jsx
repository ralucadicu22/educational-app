import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

function ForumPage() {
    const { token, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!token) return;

        fetch("http://localhost:8081/forum/posts", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then(setPosts)
            .catch((err) => setMessage("❌ Failed to fetch posts."));
    }, [token]);

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            setMessage("⚠️ Title and content are required.");
            return;
        }

        const newPost = {
            title,
            content,
            category,
            author: { id: user.id },
        };

        try {
            const response = await fetch("http://localhost:8081/forum/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newPost),
            });

            if (!response.ok) throw new Error("❌ Could not create post.");

            setMessage("✅ Post created!");
            setTitle("");
            setContent("");
            setCategory("");

            const updated = await fetch("http://localhost:8081/forum/posts", {
                headers: { Authorization: `Bearer ${token}` },
            }).then((res) => res.json());

            setPosts(updated);
        } catch (err) {
            setMessage(err.message);
        }
    };

    if (!token) {
        return <p className="text-danger">You must be logged in to view the forum.</p>;
    }

    return (
        <div className="container my-5" style={{ fontFamily: "'Rubik', sans-serif" }}>
            <h1 className="fw-bold mb-4 text-purple">📢 Forum</h1>

            {message && (
                <div
                    className={`alert text-center fw-semibold ${
                        message.startsWith("✅") ? "alert-success" : "alert-warning"
                    }`}
                >
                    {message}
                </div>
            )}

            <div
                className="card p-4 mb-5 shadow-sm"
                style={{ borderRadius: "16px", backgroundColor: "#fffaf4" }}
            >
                <h4 className="fw-semibold mb-3">✍️ Create a New Post</h4>
                <form onSubmit={handleCreatePost}>
                    <input
                        type="text"
                        placeholder="Title"
                        className="form-control mb-2"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <textarea
                        placeholder="Write your thoughts..."
                        className="form-control mb-2"
                        rows={4}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Category (optional)"
                        className="form-control mb-3"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="btn fw-semibold text-white"
                        style={{
                            backgroundColor: "#6f42c1",
                            borderRadius: "10px",
                            boxShadow: "0 3px 8px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        ➕ Add Post
                    </button>
                </form>
            </div>

            <h4 className="fw-bold mb-4">🗂 All Posts</h4>
            {posts.length === 0 ? (
                <p className="text-muted">No posts yet. Be the first to post something!</p>
            ) : (
                <div className="row">
                    {posts.map((post) => (
                        <div key={post.id} className="col-md-6 col-lg-4 mb-4">
                            <div
                                className="card h-100 shadow-sm p-3"
                                onClick={() => navigate(`/forum/${post.id}`)}
                                style={{
                                    borderRadius: "14px",
                                    cursor: "pointer",
                                    transition: "transform 0.2s",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                            >
                                <h5 className="fw-bold mb-1 text-purple">{post.title}</h5>
                                <p className="text-muted mb-2" style={{ fontSize: "0.95rem" }}>
                                    {post.content?.length > 70
                                        ? post.content.substring(0, 70) + "..."
                                        : post.content}
                                </p>
                                {post.category && (
                                    <span
                                        className="badge rounded-pill"
                                        style={{
                                            backgroundColor: "#e6ccff",
                                            color: "#5a189a",
                                            fontSize: "0.8rem",
                                        }}
                                    >
                                        {post.category}
                                    </span>
                                )}
                                <div className="text-end mt-3">
                                    <small className="text-muted">
                                        Posted by <b>{post.author?.username || "Anonymous"}</b>
                                    </small>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ForumPage;
