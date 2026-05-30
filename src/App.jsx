import { useCallback, useState } from 'react'
import { fetchPersonalityResult } from './api/anthropic'
import AppShell from './components/AppShell'
import FaceScan from './screens/FaceScan'
import FlagQuiz from './screens/FlagQuiz'
import Home from './screens/Home'
import Processing from './screens/Processing'
import Result from './screens/Result'

const SCREENS = {
  home: 'home',
  scan: 'scan',
  quiz: 'quiz',
  processing: 'processing',
  result: 'result',
}

const FADE_MS = 300

export default function App() {
  const [screen, setScreen] = useState(SCREENS.home)
  const [transitioning, setTransitioning] = useState(false)
  const [displayScreen, setDisplayScreen] = useState(SCREENS.home)
  const [answers, setAnswers] = useState([])
  const [result, setResult] = useState(null)
  const [resultLoading, setResultLoading] = useState(false)

  const goTo = useCallback((next) => {
    if (next === displayScreen) return
    setTransitioning(true)
    setTimeout(() => {
      setScreen(next)
      setDisplayScreen(next)
      setTransitioning(false)
    }, FADE_MS)
  }, [displayScreen])

  const handleScanComplete = () => goTo(SCREENS.quiz)

  const handleQuizComplete = (quizAnswers) => {
    setAnswers(quizAnswers)
    goTo(SCREENS.processing)
  }

  const handleProcessingComplete = useCallback(async (quizAnswers) => {
    goTo(SCREENS.result)
    setResultLoading(true)
    setResult(null)
    const personality = await fetchPersonalityResult(quizAnswers)
    setResult(personality)
    setResultLoading(false)
  }, [goTo])

  const handleRetake = () => {
    setAnswers([])
    setResult(null)
    setResultLoading(false)
    goTo(SCREENS.home)
  }

  const renderScreen = () => {
    switch (displayScreen) {
      case SCREENS.home:
        return <Home onStart={() => goTo(SCREENS.scan)} />
      case SCREENS.scan:
        return <FaceScan onComplete={handleScanComplete} />
      case SCREENS.quiz:
        return <FlagQuiz onComplete={handleQuizComplete} />
      case SCREENS.processing:
        return <Processing answers={answers} onComplete={handleProcessingComplete} />
      case SCREENS.result:
        return (
          <Result
            result={result}
            loading={resultLoading}
            onRetake={handleRetake}
          />
        )
      default:
        return <Home onStart={() => goTo(SCREENS.scan)} />
    }
  }

  return (
    <AppShell>
      <div
        className={`min-h-[100dvh] ${transitioning ? 'screen-exit' : 'screen-enter'}`}
        key={displayScreen}
      >
        {renderScreen()}
      </div>
    </AppShell>
  )
}
