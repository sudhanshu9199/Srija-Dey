import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import style from './Quiz.module.scss';
import { questions } from '../../data/questions';
import popAudio from '../../assets/sounds/pop.mp3'
import winAudio from '../../assets/sounds/win.mp3'
import errorAudio from '../../assets/sounds/errorSound.mp3'

const popSound = new Audio(popAudio);
const winSound = new Audio(winAudio);
const errorSound = new Audio(errorAudio); 

function Quiz() {
  const studentName = "Srija Dey"; // Updated Name
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrectState, setIsCorrectState] = useState(null); // To style specific button

  useEffect(() => {
    popSound.load();
    winSound.load();
    errorSound.load();
  }, []);

  const handleAnswerOptionClick = (index) => {
    // 1. Set the selected option immediately
    setSelectedOption(index);
    const isCorrect = index === questions[currentQuestion].correct;
    setIsCorrectState(isCorrect);

    // 2. LOGIC FIX: Play specific sound based on result (Prevents overlapping sounds)
    if (isCorrect) {
      popSound.currentTime = 0;
      popSound.play().catch((e) => console.log("Audio interaction blocked", e));
    } else {
      errorSound.currentTime = 0;
      errorSound.play().catch(() => {});
    }

    // 3. LOGIC FIX: Vibration is now independent of Sound
    // (This ensures sound still works on devices without vibration support)
    if (navigator.vibrate) {
      if (isCorrect) {
        navigator.vibrate(50); // Short tick
      } else {
        navigator.vibrate([50, 50, 50]); // Heavy buzz
      }
    }

    if (isCorrect) {
      setScore(score + 1);
      setFeedback(questions[currentQuestion].explanation);
    } else {
      setFeedback("Oop! Not quite. Check the notes! 🧬");
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

        winSound.play().catch((e) => console.log("Audio interaction blocked", e));
        if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]);
      }
    }, 3000);
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  const optionVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({ 
      opacity: 1, 
      x: 0, 
      transition: { delay: i * 0.1 } 
    }),
    hover: { scale: 1.03, originX: 0 }
  };

  return (
    <div className={style.app}>
      <div className={style.backgroundShapes}></div> {/* Background Animation */}

      <motion.div 
        className={style.container}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {showScore ? (
          <motion.div 
            className={style.scoreSection}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h2>Quiz Slayed! ✨</h2>
            <div className={style.gauge}>
              <span>{score}</span> <span className={style.total}>/ {questions.length}</span>
            </div>
            <p className={style.message}>
              {score === questions.length ? "Queen of Biology! 👑🦠" : 
               score > 5 ? "Solid effort! You're getting there! 🌿" : "Let's re-read that chapter! 📚"}
            </p>
            <button className={style.restartBtn} onClick={() => window.location.reload()}>
              Replay Level 🔄
            </button>
          </motion.div>
        ) : (
          <>
            <div className={style.header}>
               <div className={style.badge}>Biology • Tissues</div>
               <div className={style.progressText}>
                 Q{currentQuestion + 1} <span className={style.total}>/ {questions.length}</span>
               </div>
            </div>

            <div className={style.progressBar}>
                <motion.div 
                  className={style.fill} 
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></motion.div>
            </div>

            <AnimatePresence mode='wait'>
              <motion.div 
                key={currentQuestion} 
                className={style.questionSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className={style.questionText}>
                  {questions[currentQuestion].question}
                </div>
              </motion.div>
            </AnimatePresence>
            
            <div className={style.answerSection}>
              {questions[currentQuestion].options.map((option, index) => (
                <motion.button 
                  key={index} 
                  custom={index}
                  variants={optionVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  whileTap={{ scale: 0.98 }}
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
                </motion.button>
              ))}
            </div>
            
            <AnimatePresence>
              {feedback && (
                <motion.div 
                  className={`${style.feedbackPopup} ${isCorrectState ? style.success : style.error}`}
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {feedback}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default Quiz;