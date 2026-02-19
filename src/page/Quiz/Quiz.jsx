import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { Volume2, Play, ArrowRight } from 'lucide-react';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css'; // LaTeX ki CSS zaroori hai
import styles from './Quiz.module.scss';
import { questions } from '../../data/questions';

const Quiz = () => {
  const [currentQues, setCurrentQues] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  
  // Naye states feedback aur explanation flow ke liye
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Sound effects logic
  const playPop = () => new Audio('/src/assets/sounds/pop.mp3').play();
  const playWin = () => new Audio('/src/assets/sounds/win.mp3').play();
  const playError = () => new Audio('/src/assets/sounds/errorSound.mp3').play();

  const handleAnswer = (index, isCorrect) => {
    // Agar already answer de diya hai, toh double click prevent karo
    if (showExplanation) return; 

    setSelectedAnswer(index);
    setShowExplanation(true);
    
    if (isCorrect) {
      playPop();
      setScore(score + 1);
    } else {
      playError(); 
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    
    const nextQues = currentQues + 1;
    if (nextQues < questions.length) {
      setCurrentQues(nextQues);
    } else {
      playWin();
      setShowResult(true);
    }
  };

  return (
    <div className={styles.appContainer}>
      <div className={styles.waveBg}></div>

      <AnimatePresence mode="wait">
        {showResult ? (
          <motion.div 
            key="result"
            className={styles.glassCard}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
          >
            <Confetti recycle={false} numberOfPieces={400} colors={['#ff71ce', '#01cdfe', '#05ffa1', '#b967ff']} />
            <h2 className={styles.gradientText}>Quiz Completed! 🎧</h2>
            <p className={styles.scoreText}>You scored {score} out of {questions.length}</p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={styles.neonBtn}
              onClick={() => window.location.reload()}
            >
              Replay Vibe <Play size={18} />
            </motion.button>
          </motion.div>
        ) : (
          <motion.div 
            key="question"
            className={styles.glassCard}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4, type: "spring" }}
          >
            <div className={styles.header}>
              <Volume2 className={styles.iconGlow} />
              <span>Frequency {currentQues + 1} / {questions.length}</span>
            </div>

            {/* LaTeX Text Wrapper for Math Equations */}
            <h2 className={styles.questionText}>
              <Latex>{questions[currentQues].question}</Latex>
            </h2>

            <motion.div className={styles.optionsGrid}>
              {questions[currentQues].options.map((option, index) => {
                const isCorrect = index === questions[currentQues].correct;
                
                // Color logic: Agar answer check ho chuka hai
                let btnStyle = styles.optionBtn;
                if (showExplanation) {
                  if (isCorrect) {
                    btnStyle = `${styles.optionBtn} ${styles.correctOption}`;
                  } else if (selectedAnswer === index) {
                    btnStyle = `${styles.optionBtn} ${styles.wrongOption}`;
                  }
                }

                return (
                  <motion.button
                    key={index}
                    whileHover={!showExplanation ? { scale: 1.03, boxShadow: "0px 0px 15px rgba(255, 113, 206, 0.4)" } : {}}
                    whileTap={!showExplanation ? { scale: 0.95 } : {}}
                    className={btnStyle}
                    onClick={() => handleAnswer(index, isCorrect)}
                    disabled={showExplanation} // Disable clicking other options after selection
                  >
                    <Latex>{option}</Latex>
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Explanation Box - smoothly animates in */}
            <AnimatePresence>
              {showExplanation && (
                <motion.div 
                  className={styles.explanationBox}
                  initial={{ opacity: 0, y: 20, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: 10, height: 0 }}
                >
                  <p className={styles.explanationText}>
                    <Latex>{questions[currentQues].explanation}</Latex>
                  </p>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={styles.nextBtn}
                    onClick={handleNext}
                  >
                    Next Vibe <ArrowRight size={18} />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
            
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Quiz;