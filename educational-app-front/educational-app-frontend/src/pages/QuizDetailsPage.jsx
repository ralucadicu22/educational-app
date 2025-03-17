import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

function QuizDetailsPage() {
    const { quizId } = useParams();
    const { token, role } = useContext(AuthContext);
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0);


    const [timeLeft, setTimeLeft] = useState(null); // secunde


    useEffect(() => {

        fetch(`http://localhost:8081/quizzes/${quizId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => setQuiz(data))
            .catch((err) => console.error(err));

        fetch(`http://localhost:8081/questions/quiz/${quizId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => setQuestions(data))
            .catch((err) => console.error(err));
    }, [quizId, token]);

    useEffect(() => {
        if (quiz && quiz.time) {
            setTimeLeft(quiz.time * 60);
        }
    }, [quiz]);


    useEffect(() => {

        if (timeLeft === null || timeLeft <= 0) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    handleSubmitQuiz();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);


        return () => clearInterval(interval);
    }, [timeLeft]);

    const handleSelectAnswer = (answerId, isCorrect) => {
        if (isCorrect) {
            setCorrectAnswersCount((prev) => prev + 1);
        }
        setSelectedAnswers((prev) =>
            prev.includes(answerId)
                ? prev.filter((id) => id !== answerId)
                : [...prev, answerId]
        );
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        } else {
            handleSubmitQuiz();
        }
    };

    const handleSubmitQuiz = async () => {
        try {
            const response = await fetch(
                `http://localhost:8081/attempts/submit/${quizId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(selectedAnswers),
                }
            );

            if (response.ok) {
                const attempt = await response.json();
                navigate(`/attempts/user/${attempt.user.id}`);
            } else {
                alert("Failed to submit quiz attempt.");
            }
        } catch (error) {
            console.error("Error submitting quiz attempt:", error);
        }
    };

    if (!quiz || questions.length === 0) {
        return <div>Loading quiz...</div>;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const minutes = Math.floor((timeLeft ?? 0) / 60);
    const seconds = (timeLeft ?? 0) % 60;

    return (
        <div className="container mt-4">
            <h2>{quiz.title}</h2>
            <p>{quiz.content}</p>
            {/* Timer vizual */}
            {timeLeft !== null && (
                <h5 className="text-danger">
                    Time Left: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                </h5>
            )}

            <div className="progress my-3">
                <div
                    className="progress-bar bg-success"
                    role="progressbar"
                    style={{
                        width: `${(currentQuestionIndex / questions.length) * 100}%`,
                    }}
                >
                    {currentQuestionIndex + 1} / {questions.length}
                </div>
            </div>

            <h5>✅ Score: {correctAnswersCount} / {questions.length}</h5>
            <hr />
            <h4>{currentQuestion.text}</h4>
            {currentQuestion.answers.map((ans) => (
                <div key={ans.id} className="form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={selectedAnswers.includes(ans.id)}
                        onChange={() => handleSelectAnswer(ans.id, ans.correct)}
                        id={`answer-${ans.id}`}
                    />
                    <label className="form-check-label" htmlFor={`answer-${ans.id}`}>
                        {ans.text}
                    </label>
                </div>
            ))}

            <button
                className="btn btn-primary mt-3"
                onClick={handleNextQuestion}
            >
                {currentQuestionIndex === questions.length - 1
                    ? "Finish Quiz"
                    : "Next Question ➡️"}
            </button>
        </div>
    );
}

export default QuizDetailsPage;
