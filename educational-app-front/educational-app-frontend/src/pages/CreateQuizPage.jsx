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
            weekNumberFromURL ? parseInt(weekNumberFromURL, 10) : "");
    const addQuestion = () => {
        setQuestions((prev) => [
            ...prev,
            { text: "", answers: [{ text: "", correct: false }] },
        ]);
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


    const updateQuestionText = (qIndex, text) => {
        setQuestions((prev) => {
            const updated = [...prev];
            updated[qIndex].text = text;
            return updated;
        });
    };

    const addAnswer = (qIndex) => {
        setQuestions((prev) => {
            const updated = [...prev];
            updated[qIndex].answers.push({ text: "", correct: false });
            return updated;
        });
    };

    const updateAnswerText = (qIndex, aIndex, text) => {
        setQuestions((prev) => {
            const updated = [...prev];
            updated[qIndex].answers[aIndex].text = text;
            return updated;
        });
    };

    const toggleCorrectAnswer = (qIndex, aIndex) => {
        setQuestions((prev) => {
            const updated = [...prev];
            updated[qIndex].answers[aIndex].correct =
                !updated[qIndex].answers[aIndex].correct;
            return updated;
        });
    };

    return (
        <div className="container mt-5">
            <h2>Create a Quiz</h2>

            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-control mb-2"
            />
            <input
                type="text"
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="form-control mb-2"
            />
            <input
                type="number"
                placeholder="Time in minutes"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="form-control mb-2"
            />
            <input
                       type="number"
                          placeholder="Week number"
                          value={weekNumber}
                         onChange={(e) => setWeekNumber(e.target.value)}
                           className="form-control mb-2"
                       />
            <h3>Questions</h3>
            {questions.map((q, qIndex) => (
                <div key={qIndex} className="border p-3 rounded mb-3">
                    <input
                        type="text"
                        placeholder="Question text"
                        value={q.text}
                        onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                        className="form-control mb-2"
                    />

                    <h5>Answers</h5>
                    {q.answers.map((answer, aIndex) => (
                        <div key={aIndex} className="d-flex align-items-center mb-2">
                            <input
                                type="text"
                                placeholder="Answer text"
                                value={answer.text}
                                onChange={(e) => updateAnswerText(qIndex, aIndex, e.target.value)}
                                className="form-control me-2"
                            />
                            <input
                                type="checkbox"
                                checked={answer.correct}
                                onChange={() => toggleCorrectAnswer(qIndex, aIndex)}
                                className="form-check-input"
                            />
                            <label className="ms-2">Correct</label>
                        </div>
                    ))}

                    <button
                        className="btn btn-sm btn-outline-secondary mt-2"
                        onClick={() => addAnswer(qIndex)}
                    >
                        Add Answer
                    </button>
                </div>
            ))}

            <button className="btn btn-secondary mt-2" onClick={addQuestion}>
                Add Question
            </button>

            <button className="btn btn-primary mt-3" onClick={handleCreateQuiz}>
                Create Quiz
            </button>
        </div>
    );
}

export default CreateQuizPage;
