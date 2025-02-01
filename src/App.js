import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [loading, setLoading] = useState(true);
  const [answerFeedback, setAnswerFeedback] = useState("");

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        let config = {
          method: "get",
          maxBodyLength: Infinity,
          url: "http://localhost:5000/api",
        };
        const response = await axios.request(config);
        if (response.data && response.data.questions) {
          setQuestions(response.data.questions);
        }
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, []);

  if (loading) return <div className="loading">Loading Quiz...</div>;

  const handleAnswer = (answer) => {
    const correctAnswer = questions[currentIndex].options.find(
      (option) => option.is_correct
    ).description;

    if (answer === correctAnswer) {
      setScore(score + 10);
      setAnswerFeedback("Correct! 🎉");
    } else {
      setAnswerFeedback("Oops! Wrong Answer 😕");
    }

    setSelectedAnswer(answer);

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSelectedAnswer(null);
        setAnswerFeedback("");
      } else {
        setGameOver(true);
      }
    }, 1500);
  };

  if (gameOver) {
    return (
      <div className="game-over">
        <h2>🎉 Quiz Completed! 🎉</h2>
        <p>
          Your Score: {score} / {questions.length * 10}
        </p>
        <button
          className="btn restart"
          onClick={() => window.location.reload()}
        >
          Restart Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h2 className="question">{questions[currentIndex].description}</h2>

      <div className="options">
        {questions[currentIndex].options.map((option, idx) => (
          <button
            key={idx}
            className={`btn option ${
              selectedAnswer === option.description ? "selected" : ""
            }`}
            onClick={() => handleAnswer(option.description)}
          >
            {option.description}
          </button>
        ))}
      </div>

      <div className={`feedback ${answerFeedback ? "visible" : ""}`}>
        {answerFeedback}
      </div>

      <div className="progress">
        <span>
          Progress: {currentIndex + 1} / {questions.length}
        </span>
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{
              width: `${((currentIndex + 1) / questions.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default App;
