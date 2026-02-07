import { useState } from 'react'
import Quiz from './page/Quiz/Quiz'
import introVideo from './assets/intro2.mp4'

const App = () => {
  // State to track if the intro video is playing
  const [isPlaying, setIsPlaying] = useState(true)

  return (
    <>
      {isPlaying ? (
        <div className="intro-video-container">
          <video 
            autoPlay 
            muted 
            playsInline 
            onEnded={() => setIsPlaying(false)} // Hides video when it finishes
            className="intro-video"
          >
            <source src={introVideo} type="video/mp4" />
          </video>
        </div>
      ) : (
        <Quiz />
      )}
    </>
  )
}

export default App