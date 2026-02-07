import React, { useState } from 'react';
import style from './Quiz.module.scss';
import { questions } from '../../data/questions';

function Quiz() {
  const studentName = "Sriya";
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);

  const handleAnswerOptionClick = (index) => {
    setSelectedOption(index);
    const isCorrect = index === questions[currentQuestion].correct;
    
    if (isCorrect) {
      setScore(score + 1);
      setFeedback(questions[currentQuestion].explanation);
    } else {
      setFeedback("Oops! Try reviewing the notes again. 📉");
    }

    // Delay to show feedback before moving next
    setTimeout(() => {
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
        setSelectedOption(null);
        setFeedback("");
      } else {
        setShowScore(true);
      }
    }, 2500);
  };

  const getPersonalizedMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) return `Outstanding, ${studentName}! You are a Chemistry Genius! 🌟🏆`;
    if (percentage >= 80) return `Great job, ${studentName}! Almost perfect. Keep it up! 🚀`;
    if (percentage >= 50) return `Good effort, ${studentName}. Let's revise the 'Isotopes' chapter again. 📚`;
    return `Don't worry, ${studentName}. Practice makes perfect! Let's try again? 💪`;
  };

  return (
    <div className="app">
      <div className="container">
        {showScore ? (
          <div className="score-section">
            <h2>Quiz Completed!</h2>
            <div className="gauge">
              <span>{score} / {questions.length}</span>
            </div>
            <p className="message">{getPersonalizedMessage()}</p>
            <button onClick={() => window.location.reload()}>Restart Quiz 🔄</button>
          </div>
        ) : (
          <>
            <div className="question-section">
              <div className="question-count">
                <span>Question {currentQuestion + 1}</span>/{questions.length}
              </div>
              <div className="question-text">{questions[currentQuestion].question}</div>
              <div className="progress-bar">
                <div 
                  className="fill" 
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="answer-section">
              {questions[currentQuestion].options.map((option, index) => (
                <button 
                  key={index} 
                  onClick={() => handleAnswerOptionClick(index)}
                  className={selectedOption === index ? 
                    (index === questions[currentQuestion].correct ? "correct" : "wrong") 
                    : ""}
                  disabled={selectedOption !== null}
                >
                  {option}
                </button>
              ))}
            </div>
            
            {feedback && <div className="feedback-popup">{feedback}</div>}
          </>
        )}
      </div>
    </div>
  );
}

export default Quiz;