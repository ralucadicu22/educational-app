import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

function QuizAttemptListPage() {
    const { user, token, role } = useContext(AuthContext);
    const { courseId } = useParams();
    const userId = user?.id || localStorage.getItem("userId");

    const [attempts, setAttempts] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [motivationMessage, setMotivationMessage] = useState("");

    useEffect(() => {
        if (role !== "Student" || !userId) return;
        fetch(`http://localhost:8081/attempts/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("✅ Student attempts:", data);
                setAttempts(data);
                if (data.length > 0 && data[0].quiz && data[0].quiz.course) {
                    const courseIdFromAttempt = data[0].quiz.course.id;
                    calculateMotivationMessage(data, courseIdFromAttempt);
                } else {
                    setMotivationMessage("You haven't completed any quizzes yet. Start now to climb the leaderboard!");
                }
            })
            .catch((err) => console.error("Error fetching attempts:", err));
    }, [userId, token, role]);

    useEffect(() => {
        if (role !== "Teacher" || !courseId) return;
        fetch(`http://localhost:8081/attempts/leaderboard/course/${courseId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("🏆 Leaderboard data:", data);
                setLeaderboard(data);
            })
            .catch((err) => console.error("Error fetching leaderboard:", err));
    }, [courseId, token, role]);

    const calculateMotivationMessage = (studentAttempts, realCourseId) => {
        const totalScore = studentAttempts.reduce((sum, a) => sum + a.score, 0);
        fetch(`http://localhost:8081/attempts/leaderboard/course/${realCourseId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((res) => res.json())
            .then((fullLeaderboard) => {
                if (!fullLeaderboard || fullLeaderboard.length === 0) {
                    setMotivationMessage("🎯 Keep going! Every attempt matters!");
                    return;
                }

                const sorted = [...fullLeaderboard].sort((a, b) => b.totalScore - a.totalScore);
                const studentRank = sorted.findIndex(s => Number(s.userId) === Number(userId)) + 1;

                if (studentRank === 1) {
                    setMotivationMessage("🏆 You're at the top! Keep defending your position!");
                } else {
                    const nextAbove = sorted[studentRank - 2];
                    if (!nextAbove) {
                        setMotivationMessage("🚀 Keep going! Every point counts!");
                    } else {
                        const neededPoints = nextAbove.totalScore - totalScore ;
                        setMotivationMessage(`📈 You're ranked #${studentRank}. You need ${neededPoints} more points to surpass ${nextAbove.username}!`);
                    }
                }
            })
            .catch((err) => console.error("Error fetching real leaderboard for motivation:", err));
    };

    return (
        <div className="container mt-4">
            <h1>📊 My Quiz Attempts</h1>

            {/* STUDENT */}
            {role === "Student" && (
                <>
                    <h3>Your Quiz Progress</h3>
                    <ul className="list-group">
                        {attempts.map((attempt) => (
                            <li key={attempt.id} className="list-group-item">
                                Quiz ID: {attempt.quiz.id}, Score: {attempt.score}, Date: {attempt.attemptTime}
                            </li>
                        ))}
                    </ul>
                    {motivationMessage && <p className="text-info mt-3">{motivationMessage}</p>}
                </>
            )}

            {role === "Teacher" && leaderboard.length > 0 && (
                <>
                    <h3>🏆 Live Leaderboard</h3>
                    <table className="table table-striped mt-3">
                        <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Name</th>
                            <th>Total Score</th>
                            <th>Quizzes Completed</th>
                        </tr>
                        </thead>
                        <tbody>
                        {leaderboard.map((student, index) => (
                            <tr key={student.userId} className={index === 0 ? "table-success" : ""}>
                                <td>#{index + 1}</td>
                                <td>{student.username}</td>
                                <td>{student.totalScore}</td>
                                <td>{student.quizzesCompleted}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
}

export default QuizAttemptListPage;
