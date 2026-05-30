import { useEffect, useRef, useState } from 'react'
import {
  fetchAttachmentDNA,
  fetchPerfectMatch,
  fetchToxicPattern,
} from '../api/proFeatures'
import CardSkeleton from '../components/CardSkeleton'
import LockedFeatureCard from '../components/LockedFeatureCard'
import PaywallModal from '../components/PaywallModal'
import { LOCKED_PRO_FEATURES } from '../constants/lockedFeatures'
import AttachmentDNAChart from '../components/pro/AttachmentDNAChart'
import ScreenWrapper from '../components/ScreenWrapper'
import FixedBottomBar from '../components/FixedBottomBar'
import { fireResultConfetti } from '../utils/confetti'
import { shareFreeResult } from '../utils/shareFreeCard'
import { shareProResult } from '../utils/shareProCard'
function FadeCard({ show, children, className = '' }) {
  if (!show) return <CardSkeleton />
  return (
    <div className={`pro-card-fade card p-5 ${className}`}>
      {children}
    </div>
  )
}

export default function Result({ result, loading, answers, onRetake }) {
  const [isPro, setIsPro] = useState(false)
  const [showPaywall, setShowPaywall] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [freeSharing, setFreeSharing] = useState(false)
  const [proData, setProData] = useState({ dna: null, toxic: null, match: null })
  const [proReady, setProReady] = useState({ dna: false, toxic: false, match: false })
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
      setIsPro(false)
      setShowPaywall(false)
      setProData({ dna: null, toxic: null, match: null })
      setProReady({ dna: false, toxic: false, match: false })
    }
  }, [loading])

  useEffect(() => {
    if (!isPro || !result || !answers?.length) return

    let cancelled = false
    setProData({ dna: null, toxic: null, match: null })
    setProReady({ dna: false, toxic: false, match: false })

    fetchAttachmentDNA(answers, result).then((dna) => {
      if (cancelled) return
      setProData((prev) => ({ ...prev, dna }))
      setProReady((prev) => ({ ...prev, dna: true }))
    })

    fetchToxicPattern(answers, result).then((toxic) => {
      if (cancelled) return
      setProData((prev) => ({ ...prev, toxic }))
      setProReady((prev) => ({ ...prev, toxic: true }))
    })

    fetchPerfectMatch(answers, result).then((match) => {
      if (cancelled) return
      setProData((prev) => ({ ...prev, match }))
      setProReady((prev) => ({ ...prev, match: true }))
    })

    return () => {
      cancelled = true
    }
  }, [isPro, result, answers])

  const handleMockUnlock = () => {
    setShowPaywall(false)
    setIsPro(true)
  }

  const handleShare = async () => {
    setSharing(true)
    try {
      await shareProResult(result, proData.toxic)
    } finally {
      setSharing(false)
    }
  }

  const handleFreeShare = async () => {
    setFreeSharing(true)
    try {
      await shareFreeResult(result)
    } finally {
      setFreeSharing(false)
    }
  }

  if (loading || !result) {
    return (
      <ScreenWrapper className="flex flex-col items-center justify-center bg-white px-8">
        <div className="result-loader" />
        <p className="mt-8 text-sm text-[#6b7280]">Reading your pattern…</p>
      </ScreenWrapper>
    )
  }

  if (!isPro) {
    return (
      <>
        <ScreenWrapper hasFixedFooter className="bg-[#f8f9fa]">
          <div className="px-5 pt-8">
            <article className="result-card">
              <div className="result-card__accent" aria-hidden />
              <div className="relative p-5 pt-6 text-center">
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
                <p className="mt-5 text-[15px] italic leading-relaxed text-[#FF6B6B]">
                  {result.roast}
                </p>
                <p className="mt-5 text-xs text-[#6b7280]">
                  Your dating twin:{' '}
                  <span className="font-semibold text-[#1a1a2e]">{result.celebrity}</span>
                </p>
              </div>
            </article>

            <button
              type="button"
              disabled={freeSharing}
              onClick={handleFreeShare}
              className="btn-share-secondary mt-5"
            >
              <svg
                className="btn-share-secondary__icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
              {freeSharing ? 'Creating…' : 'Share My Result'}
            </button>

            <div className="mt-6 space-y-3">
              {LOCKED_PRO_FEATURES.map((feature) => (
                <LockedFeatureCard key={feature.title} {...feature} />
              ))}
            </div>
          </div>
        </ScreenWrapper>

        <FixedBottomBar>
          <button type="button" className="btn-primary" onClick={() => setShowPaywall(true)}>
            Unlock Your Full Profile — $1.99
          </button>
          <p className="text-center text-xs text-[#6b7280]">One time. No subscription.</p>
          <button type="button" onClick={onRetake} className="btn-secondary mt-1">
            Retake
          </button>
        </FixedBottomBar>

        {showPaywall && (
          <PaywallModal onUnlock={handleMockUnlock} onClose={() => setShowPaywall(false)} />
        )}
      </>
    )
  }

  return (
    <>
      <ScreenWrapper hasFixedFooter className="bg-[#f8f9fa]">
        <div className="space-y-5 px-5 pt-8 pb-4">
          {/* Card 1 — Dating Style (always visible when pro) */}
          <article className="pro-card-fade result-card">
            <div className="result-card__accent" aria-hidden />
            <div className="p-5 pt-6">
            <div className="text-center">
              <div className="result-emoji-ring mx-auto flex h-20 w-20 items-center justify-center rounded-full">
                <span className="text-4xl leading-none">{result.emoji}</span>
              </div>
              <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#4A90D9]">
                Dating Style
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-[#1a1a2e]">{result.style}</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-[#6b7280]">
                {result.description}
              </p>
              <p className="mt-4 text-[15px] italic leading-relaxed text-[#FF6B6B]">
                {result.roast}
              </p>
              <p className="mt-4 text-xs text-[#6b7280]">
                Your dating twin:{' '}
                <span className="font-semibold text-[#1a1a2e]">{result.celebrity}</span>
              </p>
            </div>
            </div>
          </article>

          {/* Card 2 — Attachment DNA */}
          <div>
            <h3 className="mb-3 text-lg font-extrabold text-[#1a1a2e]">Your Attachment Style DNA</h3>
            <FadeCard show={proReady.dna}>
              <AttachmentDNAChart data={proData.dna} />
            </FadeCard>
          </div>

          {/* Card 3 — Toxic Pattern */}
          <div>
            <FadeCard show={proReady.toxic}>
              <p className="text-center text-2xl">⚠️</p>
              <h3 className="mt-2 text-center text-lg font-extrabold text-[#1a1a2e]">
                Your Toxic Pattern
              </h3>
              {proData.toxic && (
                <>
                  <p className="mt-4 text-center text-2xl font-extrabold text-[#1a1a2e]">
                    {proData.toxic.pattern}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[#6b7280]">
                    {proData.toxic.description}
                  </p>
                  <div className="the-fix-box mt-4">
                    <p className="the-fix-box__label">The Fix</p>
                    <p className="the-fix-box__text">{proData.toxic.fix}</p>
                  </div>
                </>
              )}
            </FadeCard>
          </div>

          {/* Card 4 — Perfect Match */}
          <div>
            <FadeCard show={proReady.match}>
              <p className="text-center text-2xl">💙</p>
              <h3 className="mt-2 text-center text-lg font-extrabold text-[#1a1a2e]">
                Your Perfect Match
              </h3>
              {proData.match && (
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="pro-field-label">Personality</p>
                    <p className="pro-field-value">{proData.match.personality}</p>
                  </div>
                  <div>
                    <p className="pro-field-label">Their Energy</p>
                    <p className="pro-field-value">{proData.match.energy}</p>
                  </div>
                  <div>
                    <p className="pro-field-label">Their Lifestyle</p>
                    <p className="pro-field-value">{proData.match.habits}</p>
                  </div>
                  <div>
                    <p className="pro-field-label">Their Dealbreaker</p>
                    <p className="pro-field-value">{proData.match.dealbreaker}</p>
                  </div>
                </div>
              )}
            </FadeCard>
          </div>

          {/* Card 5 — Share */}
          <FadeCard show={proReady.toxic} className="text-center">
            <div className="pro-share-preview">
              <span className="text-4xl">{result.emoji}</span>
              <p className="mt-2 text-xl font-extrabold text-[#1a1a2e]">{result.style}</p>
              {proData.toxic && (
                <p className="mt-2 text-sm italic text-[#FF6B6B]">
                  Toxic pattern: {proData.toxic.pattern}
                </p>
              )}
            </div>
            <button
              type="button"
              disabled={sharing || !proReady.toxic}
              onClick={handleShare}
              className="btn-primary mt-5"
            >
              {sharing ? 'Creating…' : 'Share My Result'}
            </button>
          </FadeCard>
        </div>
      </ScreenWrapper>

      <FixedBottomBar>
        <button type="button" onClick={onRetake} className="btn-secondary">
          Retake
        </button>
      </FixedBottomBar>
    </>
  )
}
