import React, { useState } from 'react';
import style from './Quiz.module.scss';
import { questions } from '../../data/questions';

function Quiz() {
  const studentName = "Srija Dey"; // Updated Name
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrectState, setIsCorrectState] = useState(null); // To style specific button

  const handleAnswerOptionClick = (index) => {
    setSelectedOption(index);
    const isCorrect = index === questions[currentQuestion].correct;
    setIsCorrectState(isCorrect);
    
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
        setIsCorrectState(null);
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
    <div className={style.app}>
      <div className={style.backgroundShapes}></div> {/* Background Animation */}
      
      <div className={style.container}>
        {showScore ? (
          <div className={style.scoreSection}>
            <h2>Quiz Completed!</h2>
            <div className={style.gauge}>
              <span>{score}</span> <span className={style.total}>/ {questions.length}</span>
            </div>
            <p className={style.message}>{getPersonalizedMessage()}</p>
            <button className={style.restartBtn} onClick={() => window.location.reload()}>
              Restart Quiz 🔄
            </button>
          </div>
        ) : (
          <>
            <div className={style.header}>
               <div className={style.badge}>Chemistry Quiz</div>
               <div className={style.progressText}>
                 Question {currentQuestion + 1} <span className={style.total}>/ {questions.length}</span>
               </div>
            </div>

            <div className={style.progressBar}>
                <div 
                  className={style.fill} 
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
            </div>

            {/* Key added here triggers animation on change */}
            <div key={currentQuestion} className={style.questionSection}>
              <div className={style.questionText}>
                {questions[currentQuestion].question}
              </div>
            </div>
            
            <div className={style.answerSection}>
              {questions[currentQuestion].options.map((option, index) => (
                <button 
                  key={index} 
                  onClick={() => handleAnswerOptionClick(index)}
                  className={`
                    ${style.optionBtn} 
                    ${selectedOption === index ? (isCorrectState ? style.correct : style.wrong) : ""}
                    ${selectedOption !== null && index !== selectedOption ? style.disabled : ""}
                  `}
                  disabled={selectedOption !== null}
                >
                  <span className={style.letter}>{String.fromCharCode(65 + index)}</span>
                  {option}
                </button>
              ))}
            </div>
            
            {feedback && (
              <div className={`${style.feedbackPopup} ${isCorrectState ? style.success : style.error}`}>
                {feedback}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Quiz;