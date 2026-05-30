import { useState } from 'react'
import { QUIZ_QUESTIONS } from '../constants/questions'
import ScreenWrapper from '../components/ScreenWrapper'
import FixedBottomBar from '../components/FixedBottomBar'

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
    <>
      <ScreenWrapper hasFixedFooter className="bg-white">
        <div className="px-6 pt-10">
          <p className="text-center text-sm text-[#6b7280]">Confirm your scan</p>
          <p className="mt-3 text-center text-sm font-semibold text-[#4A90D9]">
            {currentIndex + 1} / {total}
          </p>

          <div className="mt-10 flex min-h-[40vh] items-center justify-center">
            <div
              key={currentIndex}
              className={`card w-full px-6 py-10 text-center ${
                sliding ? 'card-slide-out' : 'card-bounce-in'
              }`}
            >
              <p className="text-lg font-medium leading-relaxed text-[#1a1a2e]">
                {question}
              </p>
            </div>
          </div>
        </div>
      </ScreenWrapper>

      <FixedBottomBar>
        <button
          type="button"
          disabled={sliding}
          onClick={() => handleAnswer('green')}
          className="btn-flag-green"
        >
          🟢 Green Flag
        </button>
        <button
          type="button"
          disabled={sliding}
          onClick={() => handleAnswer('red')}
          className="btn-flag-red"
        >
          🔴 Red Flag
        </button>
      </FixedBottomBar>
    </>
  )
}
