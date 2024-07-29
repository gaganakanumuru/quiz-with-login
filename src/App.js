import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LoginPage from "./LoginPage";
import toast, { Toaster } from "react-hot-toast";

const questionsData = [
  {
    question: "What is the capital of France?",
    type: "mcq",
    options: ["Paris", "London", "Berlin", "Madrid"],
    answer: "Paris",
  },
  {
    question: "Which planet is known as the Red Planet?",
    type: "mcq",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    answer: "Mars",
  },
  {
    question: "What is the largest ocean on Earth?",
    type: "mcq",
    options: [
      "Atlantic Ocean",
      "Indian Ocean",
      "Arctic Ocean",
      "Pacific Ocean",
    ],
    answer: "Pacific Ocean",
  },
  {
    question: 'Who wrote "To Kill a Mockingbird"?',
    type: "blank",
    answer: "Harper Lee",
  },
  {
    question: "What is the square root of 64?",
    type: "blank",
    answer: "8",
  },
];

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [warnings, setWarnings] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      const handlePaste = (e) => {
        e.preventDefault();
        toast.error("Pasting is detected");
      };
      const handleCopy = (e) => {
        e.preventDefault();
        toast.error("Copying the text is prohibited");
      };
      window.addEventListener("paste", handlePaste);
      window.addEventListener("copy", handleCopy);

      return () => {
        window.removeEventListener("paste", handlePaste);
        window.removeEventListener("copy", handleCopy);
      };
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      const handleVisibilityChange = () => {
        if (document.hidden) {
          setWarnings((prevWarnings) => prevWarnings + 1);
          toast.error(
            `Warning ${warnings + 1}: You are not supposed to switch tabs`
          );
        }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        document.removeEventListener("visibilitychange",handleVisibilityChange);
      };
    }
  }, [isLoggedIn, warnings]);

  useEffect(() => {
    if (warnings >= 3) {
      toast.error("You have been disqualified from the exam");
      setIsLoggedIn(false);
    }
  }, [warnings]);

  const handleInputChange = (question, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [question]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let score = 0;
    questionsData.forEach((q) => {
      if (
        answers[q.question] &&
        answers[q.question].toLowerCase() === q.answer.toLowerCase()
      ) {
        score += 1;
      }
    });
    setScore(score);
    toast.success(`You scored ${score} out of ${questionsData.length}`);
  };

  return (
    <Router>
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/proctoring" />
            ) : (
              <LoginPage setIsLoggedIn={setIsLoggedIn} />
            )
          }
        />
        <Route
          path="/proctoring"
          element={
            isLoggedIn ? (
              <div className="hero bg-base-200 min-h-screen">
                <div className="hero-content text-center">
                  <div className="max-w-md">
                    <h1 className="text-5xl font-bold">The Quiz is here</h1>
                    <form onSubmit={handleSubmit}>
                      {questionsData.map((q, index) => (
                        <div key={index} className="mb-4">
                          <h2 className="text-xl">{q.question}</h2>
                          {q.type === "mcq" ? (
                            q.options.map((option, idx) => (
                              <div key={idx} className="form-control">
                                <label className="cursor-pointer label">
                                  <input
                                    type="radio"
                                    name={q.question}
                                    value={option}
                                    className="radio radio-primary"
                                    checked={answers[q.question] === option}
                                    onChange={(e) =>
                                      handleInputChange(
                                        q.question,
                                        e.target.value
                                      )
                                    }
                                  />
                                  <span className="label-text">{option}</span>
                                </label>
                              </div>
                            ))
                          ) : (
                            <input
                              type="text"
                              placeholder="Answer here"
                              className="input input-bordered w-full"
                              value={answers[q.question] || ""}
                              onChange={(e) =>
                                handleInputChange(q.question, e.target.value)
                              }
                            />
                          )}
                        </div>
                      ))}
                      <button type="submit" className="btn btn-primary">
                        Submit Exam
                      </button>
                    </form>
                    {score !== null && (
                      <div className="mt-4">
                        <h2 className="text-2xl">
                          Your Score: {score} / {questionsData.length}
                        </h2>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
