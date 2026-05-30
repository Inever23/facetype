import { useState } from 'react'
import { shareResult } from '../utils/shareCard'

export default function Result({ result, loading, onRetake }) {
  const [sharing, setSharing] = useState(false)

  if (loading || !result) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center px-8">
        <div className="result-loader" />
        <p className="mt-8 text-sm tracking-wide text-[#9a9a9a]">Reading your pattern…</p>
      </div>
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
    <div className="flex min-h-full flex-col overflow-y-auto px-5 py-8">
      <article className="result-card screen-enter">
        <div className="result-card__glow" aria-hidden />

        <div className="relative text-center">
          <div className="result-emoji-ring mx-auto flex h-24 w-24 items-center justify-center rounded-full">
            <span className="text-5xl leading-none">{result.emoji}</span>
          </div>

          <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#8b1a1a]">
            Your dating style
          </p>
          <h2 className="mt-2 text-[2rem] font-extrabold leading-tight tracking-tight text-[#faf6f2]">
            {result.style}
          </h2>

          <p className="mt-5 text-[15px] leading-relaxed text-[#f5f0eb]/80">
            {result.description}
          </p>
        </div>

        <div className="result-divider my-7" />

        <div className="space-y-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#9a9a9a]">
              Compatibility
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[#c8c0b8]">
              {result.compatibility}
            </p>
          </div>

          <div className="result-roast-block rounded-xl px-4 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8b1a1a]/80">
              The callout
            </p>
            <p className="mt-2 text-[15px] italic leading-relaxed text-[#c45c5c]">
              {result.roast}
            </p>
          </div>

          <p className="text-center text-xs tracking-wide text-[#9a9a9a]">
            Your dating twin:{' '}
            <span className="font-semibold text-[#f5f0eb]/70">{result.celebrity}</span>
          </p>
        </div>
      </article>

      <div className="mt-6 flex flex-col gap-3 pb-2">
        <button
          type="button"
          disabled={sharing}
          onClick={handleShare}
          className="btn-premium w-full rounded-2xl py-4 font-bold text-[#f5f0eb] disabled:opacity-60"
        >
          {sharing ? 'Creating…' : 'Share My Result'}
        </button>
        <button
          type="button"
          onClick={onRetake}
          className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-4 text-sm font-semibold tracking-wide text-[#f5f0eb]/85 backdrop-blur-sm transition hover:border-white/20 hover:bg-white/[0.06]"
        >
          Retake
        </button>
      </div>
    </div>
  )
}
