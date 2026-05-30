import { useEffect, useRef, useState } from 'react'
import { shareResult } from '../utils/shareCard'
import { fireResultConfetti } from '../utils/confetti'
import ScreenWrapper from '../components/ScreenWrapper'
import FixedBottomBar from '../components/FixedBottomBar'

export default function Result({ result, loading, onRetake }) {
  const [sharing, setSharing] = useState(false)
  const confettiFired = useRef(false)

  useEffect(() => {
    if (!loading && result && !confettiFired.current) {
      confettiFired.current = true
      fireResultConfetti()
    }
  }, [loading, result])

  useEffect(() => {
    if (loading) {
      confettiFired.current = false
    }
  }, [loading])

  if (loading || !result) {
    return (
      <ScreenWrapper className="flex flex-col items-center justify-center bg-white px-8">
        <div className="result-loader" />
        <p className="mt-8 text-sm text-[#6b7280]">Reading your pattern…</p>
      </ScreenWrapper>
    )
  }

  const handleShare = async () => {
    setSharing(true)
    try {
      await shareResult(result)
    } finally {
      setSharing(false)
    }
  }

  return (
    <>
      <ScreenWrapper hasFixedFooter className="bg-[#f8f9fa]">
        <div className="px-5 pt-8">
          <article className="result-card">
            <div className="result-card__accent" aria-hidden />

            <div className="relative text-center">
              <div className="result-emoji-ring mx-auto flex h-24 w-24 items-center justify-center rounded-full">
                <span className="text-5xl leading-none">{result.emoji}</span>
              </div>

              <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#4A90D9]">
                Your dating style
              </p>
              <h2 className="mt-2 text-[2rem] font-extrabold leading-tight tracking-tight text-[#1a1a2e]">
                {result.style}
              </h2>

              <p className="mt-5 text-[15px] leading-relaxed text-[#6b7280]">
                {result.description}
              </p>
            </div>

            <div className="result-divider my-7" />

            <div className="space-y-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#6b7280]">
                  Compatibility
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[#1a1a2e]">
                  {result.compatibility}
                </p>
              </div>

              <div className="result-roast-block px-4 py-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#4A90D9]">
                  The callout
                </p>
                <p className="mt-2 text-[15px] italic leading-relaxed text-[#FF6B6B]">
                  {result.roast}
                </p>
              </div>

              <p className="text-center text-xs text-[#6b7280]">
                Your dating twin:{' '}
                <span className="font-semibold text-[#1a1a2e]">{result.celebrity}</span>
              </p>
            </div>
          </article>
        </div>
      </ScreenWrapper>

      <FixedBottomBar>
        <button
          type="button"
          disabled={sharing}
          onClick={handleShare}
          className="btn-primary"
        >
          {sharing ? 'Creating…' : 'Share My Result'}
        </button>
        <button type="button" onClick={onRetake} className="btn-secondary">
          Retake
        </button>
      </FixedBottomBar>
    </>
  )
}
