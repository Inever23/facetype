import { useEffect, useState } from 'react'
import { PROCESSING_MESSAGES } from '../constants/questions'
import ScreenWrapper from '../components/ScreenWrapper'

const DURATION_MS = 6000
const MESSAGE_MS = 1000

export default function Processing({ answers, onComplete }) {
  const [messageIndex, setMessageIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const start = performance.now()
    let rafId

    const tick = (now) => {
      const elapsed = now - start
      setProgress(Math.min(100, (elapsed / DURATION_MS) * 100))
      if (elapsed < DURATION_MS) {
        rafId = requestAnimationFrame(tick)
      }
    }
    rafId = requestAnimationFrame(tick)

    const msgInterval = setInterval(() => {
      setMessageIndex((i) => Math.min(i + 1, PROCESSING_MESSAGES.length - 1))
    }, MESSAGE_MS)

    const doneTimer = setTimeout(() => {
      onComplete(answers)
    }, DURATION_MS)

    return () => {
      cancelAnimationFrame(rafId)
      clearInterval(msgInterval)
      clearTimeout(doneTimer)
    }
  }, [answers, onComplete])

  return (
    <ScreenWrapper className="flex flex-col items-center justify-center bg-white px-8">
      <div className="processing-pulse">
        <div className="processing-pulse__core" />
      </div>

      <p className="mt-10 max-w-[300px] text-center text-base leading-relaxed text-[#1a1a2e]">
        {PROCESSING_MESSAGES[messageIndex]}
      </p>

      <div className="processing-progress-track">
        <div
          className="processing-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </ScreenWrapper>
  )
}
