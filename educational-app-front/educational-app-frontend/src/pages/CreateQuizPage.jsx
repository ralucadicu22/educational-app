import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function CreateQuizPage() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [time, setTime] = useState("");
    const [questions, setQuestions] = useState([]);

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const courseId = searchParams.get("courseId");
    const weekNumberFromURL = searchParams.get("week");
    const [weekNumber, setWeekNumber] = useState(
        weekNumberFromURL ? parseInt(weekNumberFromURL, 10) : ""
    );

    const addQuestion = () => {
        setQuestions((prev) => [
            ...prev,
            { text: "", answers: [{ text: "", correct: false }] },
        ]);
    };

    const addAnswer = (qIndex) => {
        const updated = [...questions];
        updated[qIndex].answers.push({ text: "", correct: false });
        setQuestions(updated);
    };

    const updateQuestionText = (qIndex, text) => {
        const updated = [...questions];
        updated[qIndex].text = text;
        setQuestions(updated);
    };

    const updateAnswerText = (qIndex, aIndex, text) => {
        const updated = [...questions];
        updated[qIndex].answers[aIndex].text = text;
        setQuestions(updated);
    };

    const toggleCorrectAnswer = (qIndex, aIndex) => {
        const updated = [...questions];
        updated[qIndex].answers[aIndex].correct = !updated[qIndex].answers[aIndex].correct;
        setQuestions(updated);
    };

    const handleCreateQuiz = async () => {
        const quizData = {
            title,
            content,
            time: parseInt(time, 10),
            weekNumber: weekNumber ? parseInt(weekNumber, 10) : null,
            course: { id: courseId },
            questions,
        };

        const response = await fetch("http://localhost:8081/quizzes/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(quizData),
        });

        if (response.ok) {
            alert("Quiz created successfully!");
            navigate(`/courses/${courseId}`);
        } else {
            alert("Failed to create quiz");
        }
    };

    return (
        <div className="container my-5" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <h1 className="text-center fw-bold text-purple mb-4">🧠 Create a Quiz</h1>

            <div className="card p-4 shadow-sm mb-4" style={{ borderRadius: "16px", backgroundColor: "#fffaf4" }}>
                <input
                    type="text"
                    placeholder="📝 Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="form-control mb-3"
                />
                <input
                    type="text"
                    placeholder="📄 Description"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="form-control mb-3"
                />
                <input
                    type="number"
                    placeholder="⏱️ Time (minutes)"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="form-control mb-3"
                />
                <input
                    type="number"
                    placeholder="📆 Week Number"
                    value={weekNumber}
                    onChange={(e) => setWeekNumber(e.target.value)}
                    className="form-control mb-3"
                />
            </div>

            <div className="mb-4">
                <h2 className="fw-semibold mb-3">🧩 Questions</h2>
                {questions.map((q, qIndex) => (
                    <div key={qIndex} className="card p-3 mb-3 shadow-sm" style={{ borderRadius: "12px" }}>
                        <input
                            type="text"
                            placeholder="Question text"
                            value={q.text}
                            onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                            className="form-control mb-3"
                        />
                        {q.answers.map((a, aIndex) => (
                            <div key={aIndex} className="d-flex align-items-center mb-2">
                                <input
                                    type="text"
                                    value={a.text}
                                    onChange={(e) => updateAnswerText(qIndex, aIndex, e.target.value)}
                                    className="form-control me-2"
                                    placeholder="Answer text"
                                />
                                <input
                                    type="checkbox"
                                    checked={a.correct}
                                    onChange={() => toggleCorrectAnswer(qIndex, aIndex)}
                                    className="form-check-input"
                                />
                                <label className="ms-2">Correct</label>
                            </div>
                        ))}
                        <button
                            className="btn btn-sm text-purple fw-semibold border-0"
                            onClick={() => addAnswer(qIndex)}
                        >
                            ➕ Add Answer
                        </button>
                    </div>
                ))}
            </div>

            <div className="d-flex gap-2">
                <button
                    className="btn btn-outline-dark px-4 py-2 rounded-pill fw-semibold shadow-sm"
                    onClick={addQuestion}
                >
                    ➕ Add Question
                </button>
                <button
                    className="btn px-4 py-2 rounded-pill fw-semibold text-white"
                    style={{ backgroundColor: "#6f42c1", boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }}
                    onClick={handleCreateQuiz}
                >
                    ✅ Create Quiz
                </button>
            </div>
        </div>
    );
}

export default CreateQuizPage;
