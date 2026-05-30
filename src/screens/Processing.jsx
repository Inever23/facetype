import { useEffect, useState } from 'react'
import { PROCESSING_MESSAGES } from '../constants/questions'

const DURATION_MS = 2500
const MESSAGE_MS = 850

export default function Processing({ answers, onComplete }) {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMessageIndex((i) => Math.min(i + 1, PROCESSING_MESSAGES.length - 1))
    }, MESSAGE_MS)

    const doneTimer = setTimeout(() => {
      onComplete(answers)
    }, DURATION_MS)

    return () => {
      clearInterval(msgInterval)
      clearTimeout(doneTimer)
    }
  }, [answers, onComplete])

  return (
    <div className="flex min-h-full flex-col items-center justify-center px-8">
      <div
        className="h-28 w-28 rounded-full border-4 border-[#8b1a1a]/40"
        style={{ animation: 'spin-pulse 1.5s ease-in-out infinite' }}
      >
        <div className="flex h-full w-full items-center justify-center">
          <div className="h-14 w-14 rounded-full bg-[#8b1a1a]/60" />
        </div>
      </div>
      <p className="mt-10 text-center text-lg text-[#f5f0eb]/80 transition-opacity duration-300">
        {PROCESSING_MESSAGES[messageIndex]}
      </p>
    </div>
  )
}
