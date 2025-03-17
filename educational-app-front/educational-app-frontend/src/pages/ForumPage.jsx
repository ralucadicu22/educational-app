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
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch posts.");
                return res.json();
            })
            .then((data) => setPosts(data))
            .catch((err) => {
                console.error(err);
                setMessage(err.message);
            });
    }, [token]);

    const handleCreatePost = async (e) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            setMessage(" Title and content are required.");
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

            if (!response.ok) {
                const text = await response.text();
                throw new Error("Could not create post: " + text);
            }

            setMessage("Post created!");
            setTitle("");
            setContent("");
            setCategory("");

            fetch("http://localhost:8081/forum/posts", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((data) => setPosts(data));
        } catch (err) {
            console.error(err);
            setMessage("" + err.message);
        }
    };

    if (!token) {
        return <p className="text-danger">You must be logged in to view the forum.</p>;
    }

    return (
        <div className="container my-4">
            <h1>📢Check the new topics</h1>
            {message && (
                <div
                    className={`alert ${
                        message.startsWith("✅") ? "alert-success" : "alert-warning"
                    }`}
                >
                    {message}
                </div>
            )}
            <div className="card p-3 mb-4 shadow-sm">
                <h3 className="mb-3">Create a New Post</h3>
                <form onSubmit={handleCreatePost}>
                    <input
                        type="text"
                        placeholder="Title"
                        className="form-control mb-2"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <textarea
                        placeholder="Content"
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
                    <button type="submit" className="btn btn-primary">
                        Add Post
                    </button>
                </form>
            </div>

            <h3 className="mb-3">All Posts</h3>
            {posts.length === 0 ? (
                <p className="text-muted">No posts yet.</p>
            ) : (
                <div className="row">
                    {posts.map((post) => (
                        <div key={post.id} className="col-md-6 col-lg-4 mb-3">
                            <div
                                className="card h-100 shadow-sm"
                                style={{ cursor: "pointer" }}
                                onClick={() => navigate(`/forum/${post.id}`)}
                            >
                                <div className="card-body">
                                    <h5 className="card-title">{post.title}</h5>
                                    <p className="card-text">
                                        {post.content?.length > 70
                                            ? post.content.substring(0, 70) + "..."
                                            : post.content}
                                    </p>
                                    {post.category && (
                                        <span className="badge bg-info text-dark">{post.category}</span>
                                    )}
                                    <div className="mt-3 text-end">
                                        <small className="text-muted">
                                            By {post.author?.username || "Anonymous"}
                                        </small>
                                    </div>
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
