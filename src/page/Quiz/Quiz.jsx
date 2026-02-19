import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { Volume2, Play } from 'lucide-react';
import styles from './Quiz.module.scss';
import { questions } from '../../data/questions';

const Quiz = () => {
  const [currentQues, setCurrentQues] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // Sound effects logic
  const playPop = () => new Audio('/src/assets/sounds/pop.mp3').play();
  const playWin = () => new Audio('/src/assets/sounds/win.mp3').play();

  const handleAnswer = (isCorrect) => {
    playPop();
    if (isCorrect) setScore(score + 1);
    
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
      {/* Background animated sound waves */}
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

            <h2 className={styles.questionText}>{questions[currentQues].question}</h2>

            <motion.div 
              className={styles.optionsGrid}
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 }
                }
              }}
            >
              {questions[currentQues].options.map((option, index) => {
                
                const isCorrect = index === questions[currentQues].correct;

                return (
                  <motion.button
                    key={index}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    whileHover={{ scale: 1.03, boxShadow: "0px 0px 15px rgba(255, 113, 206, 0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    className={styles.optionBtn}
                    onClick={() => handleAnswer(isCorrect)}
                  >
                    {/* FIX 4: Render the 'option' string directly */}
                    {option}
                  </motion.button>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Quiz;