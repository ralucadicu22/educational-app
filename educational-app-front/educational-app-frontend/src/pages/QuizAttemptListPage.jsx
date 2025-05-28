import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

function QuizAttemptListPage() {
    const { token, user, role } = useContext(AuthContext);
    const { courseId } = useParams();
    const userId = user?.id || localStorage.getItem("userId");

    const [attempts, setAttempts] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (role === "Student") {
            fetch(`http://localhost:8081/attempts/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then(res => res.json())
                .then(data => {
                    setAttempts(data);
                    if (data.length === 0) {
                        setMessage("Start your first quiz to enter the leaderboard!");
                    } else {
                        const totalScore = data.reduce((sum, a) => sum + a.score, 0);
                        fetch(`http://localhost:8081/attempts/leaderboard/course/${data[0].quiz.course.id}`, {
                            headers: { Authorization: `Bearer ${token}` },
                        })
                            .then(res => res.json())
                            .then(board => {
                                const rank = board.findIndex(u => u.userId === Number(userId)) + 1;
                                if (rank === 1) {
                                    setMessage("🏆 You're leading the leaderboard!");
                                } else {
                                    const nextAbove = board[rank - 2];
                                    const diff = nextAbove.totalScore - totalScore;
                                    setMessage(`You're #${rank}. Score ${diff} more to beat ${nextAbove.username}!`);
                                }
                            });
                    }
                });
        }
    }, [userId, token, role]);

    useEffect(() => {
        if (role === "Teacher") {
            fetch(`http://localhost:8081/attempts/leaderboard/course/${courseId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then(res => res.json())
                .then(setLeaderboard);
        }
    }, [courseId, token, role]);

    const chartData = attempts.map(a => ({
        date: new Date(a.attemptTime).toLocaleDateString(),
        score: a.score
    }));

    return (
        <div className="container my-5" style={{ fontFamily: "'Poppins', sans-serif", color: "#333" }}>
            <div className="text-center mb-4">
                <h1 className="fw-bold">📊 Quiz Stats</h1>
                <hr style={{ width: "80px", border: "2px solid #6f42c1", margin: "10px auto" }} />
            </div>

            {role === "Student" && (
                <>

                    <div className="card p-4 shadow-sm mb-4" style={{ backgroundColor: "#fffaf4", borderRadius: "18px" }}>
                        <h2 className="fw-bold mb-3 text-purple">📈 Progress Chart</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="score" stroke="#6f42c1" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="card p-4 shadow-sm" style={{ borderRadius: "18px", backgroundColor: "#fffaf4" }}>
                        <h3 className="fw-semibold mb-3 text-purple">🧪 Attempt History</h3>
                        <ul className="list-group list-group-flush">
                            {attempts.map((a) => (
                                <li key={a.id} className="list-group-item">
                                    <span className="fw-semibold">Quiz #{a.quiz.id}</span> – Score: {a.score} – <i>{new Date(a.attemptTime).toLocaleDateString()}</i>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {message && (
                        <div
                            className="alert mt-4 text-center shadow-sm"
                            style={{
                                borderRadius: "12px",
                                backgroundColor: "#4a1e8c",
                                color: "#ffffff",
                                border: "1px solid #3a1470"
                            }}
                        >
                            {message}
                        </div>
                    )}

                </>
            )}

            {role === "Teacher" && leaderboard.length > 0 && (
                <div className="card p-4 shadow-sm" style={{ backgroundColor: "#fffaf4", borderRadius: "18px" }}>
                    <h4 className="fw-bold text-purple mb-3">🏆 Leaderboard</h4>
                    <table className="table table-hover text-center align-middle">
                        <thead className="table-light">
                        <tr>
                            <th>Rank</th>
                            <th>User</th>
                            <th>Total Score</th>
                            <th>Completed</th>
                        </tr>
                        </thead>
                        <tbody>
                        {leaderboard.map((s, i) => (
                            <tr key={s.userId} className={i === 0 ? "table-success fw-bold" : ""}>
                                <td>#{i + 1}</td>
                                <td>{s.username}</td>
                                <td>{s.totalScore}</td>
                                <td>{s.quizzesCompleted}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default QuizAttemptListPage;
