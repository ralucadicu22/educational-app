import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

function QuizDetailsPage() {
    const { quizId } = useParams();
    const { token, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8081/quizzes/${quizId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(setQuiz)
            .catch(console.error);

        fetch(`http://localhost:8081/questions/quiz/${quizId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(setQuestions)
            .catch(console.error);
    }, [quizId, token]);

    useEffect(() => {
        if (quiz?.time) setTimeLeft(quiz.time * 60);
    }, [quiz]);

    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmitQuiz();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleSelectAnswer = (answerId) => {
        setSelectedAnswers(prev =>
            prev.includes(answerId)
                ? prev.filter(id => id !== answerId)
                : [...prev, answerId]
        );
    };

    const handleNext = () => {
        if (currentQuestionIndex === questions.length - 1) {
            handleSubmitQuiz();
        } else {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handleSubmitQuiz = async () => {
        const response = await fetch(`http://localhost:8081/attempts/submit/${quizId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(selectedAnswers),
        });

        if (response.ok) {
            if (document.fullscreenElement) document.exitFullscreen();
            navigate(`/attempts/user/${user?.id || localStorage.getItem("userId")}`);
        } else {
            alert("Failed to submit quiz.");
        }
    };

    if (!quiz || questions.length === 0)
        return <p className="text-center mt-5">Loading quiz...</p>;

    const current = questions[currentQuestionIndex];
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;

    return (
        <div className="container my-5" style={{ fontFamily: "'Rubik', sans-serif" }}>
            <h2 className="text-center fw-bold text-purple mb-2">{quiz.title}</h2>
            <p className="text-muted text-center mb-4">{quiz.content}</p>

            <div className="text-center mb-4">
                <span
                    className="px-4 py-2 fw-semibold rounded-pill"
                    style={{
                        backgroundColor: "#ffe0e6",
                        color: "#c0392b",
                        fontSize: "1.2rem",
                    }}
                >
                    ⏳ Time Left: {min}:{sec < 10 ? "0" + sec : sec}
                </span>
            </div>

            <div className="progress mb-4" style={{ height: "20px" }}>
                <div
                    className="progress-bar bg-success"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                >
                    Question {currentQuestionIndex + 1} / {questions.length}
                </div>
            </div>

            <div
                className="card p-4 shadow-sm mb-4"
                style={{
                    borderRadius: "16px",
                    backgroundColor: "#fffaf4",
                    border: "1px solid #eee",
                }}
            >
                <h5 className="mb-3 fw-bold">❓ {current.text}</h5>
                {current.answers.map(ans => (
                    <div key={ans.id} className="form-check mb-2">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={selectedAnswers.includes(ans.id)}
                            onChange={() => handleSelectAnswer(ans.id)}
                            id={`answer-${ans.id}`}
                        />
                        <label className="form-check-label ms-2" htmlFor={`answer-${ans.id}`}>
                            {ans.text}
                        </label>
                    </div>
                ))}
            </div>

            <div className="text-end">
                <button
                    className="btn text-white fw-semibold px-4 py-2"
                    style={{
                        backgroundColor: "#6f42c1",
                        borderRadius: "12px",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    }}
                    onClick={handleNext}
                >
                    {currentQuestionIndex === questions.length - 1 ? "✅ Finish Quiz" : "Next ➡️"}
                </button>
            </div>
        </div>
    );
}

export default QuizDetailsPage;
