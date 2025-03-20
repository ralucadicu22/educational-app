import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

function PostDetailPage() {
    const { token, user } = useContext(AuthContext);
    const { postId } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [replyText, setReplyText] = useState({});
    const [error, setError] = useState("");


    useEffect(() => {
        if (!token) return;

        fetch(`http://localhost:8081/forum/posts/${postId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch post details");
                return res.json();
            })
            .then((data) => setPost(data))
            .catch((err) => setError(err.message));
    }, [token, postId]);


    useEffect(() => {
        if (!token) return;
        reloadComments();
    }, [token, postId]);

    const reloadComments = async () => {
        try {

            const res = await fetch(`http://localhost:8081/forum/comments/top-level/${postId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to fetch top-level comments.");
            const data = await res.json();


            const updatedComments = await Promise.all(
                data.map(async (comment) => {

                    const likesRes = await fetch(`http://localhost:8081/forum/comments/${comment.id}/likes-count`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    const dislikesRes = await fetch(`http://localhost:8081/forum/comments/${comment.id}/dislikes-count`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    const likes = likesRes.ok ? await likesRes.json() : 0;
                    const dislikes = dislikesRes.ok ? await dislikesRes.json() : 0;


                    const repliesRes = await fetch(`http://localhost:8081/forum/comments/replies/${comment.id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    const replies = repliesRes.ok ? await repliesRes.json() : [];

                    return {
                        ...comment,
                        likes,
                        dislikes,
                        replies
                    };
                })
            );

            setComments(updatedComments);
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };


    const handleCommentSubmit = async () => {
        if (!newComment.trim()) return;

        const commentData = {
            content: newComment,
            post: { id: postId },
            author: { id: user.id }
        };

        try {
            const res = await fetch("http://localhost:8081/forum/comments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(commentData)
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error("Error posting comment: " + text);
            }

            setNewComment("");
            reloadComments();
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };


    const handleReplySubmit = async (parentCommentId) => {
        const text = replyText[parentCommentId];
        if (!text || !text.trim()) return;

        const replyData = {
            content: text,
            author: { id: user.id }
        };

        try {
            const res = await fetch(`http://localhost:8081/forum/comments/reply/${parentCommentId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(replyData)
            });
            if (!res.ok) throw new Error("Failed to post reply.");

            setReplyText((prev) => ({ ...prev, [parentCommentId]: "" }));
            reloadComments();
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    const handleReplyChange = (commentId, text) => {
        setReplyText((prev) => ({ ...prev, [commentId]: text }));
    };

    const handleLikeComment = async (commentId) => {
        try {
            await fetch(`http://localhost:8081/forum/comments/${commentId}/like/${user.id}`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` }
            });
            reloadComments();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDislikeComment = async (commentId) => {
        try {
            await fetch(`http://localhost:8081/forum/comments/${commentId}/dislike/${user.id}`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` }
            });
            reloadComments();
        } catch (err) {
            console.error(err);
        }
    };

    if (!token) {
        return <p className="text-danger">You must be logged in to view this post.</p>;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    if (!post) {
        return <p>Loading post...</p>;
    }

    return (
        <div className="container mt-4">
            <button className="btn btn-link mb-3" onClick={() => navigate("/forum")}>
                ← Back to Forum
            </button>

            <h1>{post.title}</h1>
            <p>{post.content}</p>
            <p className="text-muted">Category: {post.category || "none"}</p>

            <hr />

            <h3>💬 Comments</h3>
            {comments.length === 0 ? (
                <p>No comments yet.</p>
            ) : (
                <ul className="list-group mb-3">
                    {comments.map((comment) => (
                        <li key={comment.id} className="list-group-item">
                            <strong>{comment.author?.username || "Anonymous"}</strong>: {comment.content}
                            <div className="mt-2">
                                <span className="me-2">👍 {comment.likes}</span>
                                <span className="me-2">👎 {comment.dislikes}</span>
                                <button
                                    className="btn btn-sm btn-outline-success me-1"
                                    onClick={() => handleLikeComment(comment.id)}
                                >
                                    👍 Like
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-danger me-1"
                                    onClick={() => handleDislikeComment(comment.id)}
                                >
                                    👎 Dislike
                                </button>
                                <textarea
                                    className="form-control mb-1"
                                    placeholder="Reply to this comment..."
                                    value={replyText[comment.id] || ""}
                                    onChange={(e) => handleReplyChange(comment.id, e.target.value)}
                                />
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => handleReplySubmit(comment.id)}
                                >
                                    Submit Reply
                                </button>
                            </div>

                            {comment.replies && comment.replies.length > 0 && (
                                <ul className="list-group mt-3">
                                    {comment.replies.map((rep) => (
                                        <li key={rep.id} className="list-group-item ms-4">
                                            <strong>{rep.author?.username || "Anonymous"}</strong>: {rep.content}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            )}


            <div className="card p-3">
                <h5>Add a Comment</h5>
                <textarea
                    className="form-control mb-2"
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <button className="btn btn-success w-100" onClick={handleCommentSubmit}>
                    Post Comment
                </button>
            </div>
        </div>
    );
}

export default PostDetailPage;
