import { useState } from 'react'
import { QUIZ_QUESTIONS } from '../constants/questions'

export default function FlagQuiz({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [sliding, setSliding] = useState(false)

  const question = QUIZ_QUESTIONS[currentIndex]
  const total = QUIZ_QUESTIONS.length

  const handleAnswer = (flag) => {
    if (sliding) return

    const nextAnswers = [...answers, flag]
    setSliding(true)

    setTimeout(() => {
      if (currentIndex >= total - 1) {
        onComplete(nextAnswers)
      } else {
        setAnswers(nextAnswers)
        setCurrentIndex((i) => i + 1)
        setSliding(false)
      }
    }, 350)
  }

  return (
    <div className="flex min-h-full flex-col px-6 py-10">
      <p className="text-center text-sm text-[#9a9a9a]">Confirm your scan</p>
      <p className="mt-4 text-center text-sm font-semibold text-[#f5f0eb]/70">
        {currentIndex + 1} / {total}
      </p>

      <div className="flex flex-1 flex-col items-center justify-center">
        <div
          key={currentIndex}
          className={`w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-10 text-center backdrop-blur-sm ${
            sliding ? 'card-slide-out' : 'screen-enter'
          }`}
        >
          <p className="text-lg font-medium leading-relaxed text-[#f5f0eb]">
            {question}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 pb-4">
        <button
          type="button"
          disabled={sliding}
          onClick={() => handleAnswer('green')}
          className="w-full rounded-2xl bg-emerald-900/80 py-5 text-lg font-bold text-emerald-100 transition active:scale-[0.98] disabled:opacity-50"
        >
          🟢 Green Flag
        </button>
        <button
          type="button"
          disabled={sliding}
          onClick={() => handleAnswer('red')}
          className="w-full rounded-2xl bg-red-950/80 py-5 text-lg font-bold text-red-100 transition active:scale-[0.98] disabled:opacity-50"
        >
          🔴 Red Flag
        </button>
      </div>
    </div>
  )
}
