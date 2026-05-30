import ScreenWrapper from '../components/ScreenWrapper'
import FixedBottomBar from '../components/FixedBottomBar'
import { resumeAudioContext } from '../utils/scanAudio'

export default function Home({ onStart }) {
  const handleStart = () => {
    resumeAudioContext()
    onStart()
  }

  return (
    <>
      <ScreenWrapper hasFixedFooter className="home-gradient-bg">
        <div className="px-8 pt-16 pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#4A90D9]">
            Dating personality
          </p>
          <h1 className="facetype-title mt-3 text-5xl tracking-tight text-[#1a1a2e]">
            FaceType
          </h1>
          <p className="mt-5 text-xl font-semibold leading-snug text-[#1a1a2e]">
            Your face reveals how you love.
          </p>
          <p className="mt-3 text-base leading-relaxed text-[#6b7280]">
            Takes 60 seconds. Uncomfortably accurate.
          </p>

          <div className="section-alt mt-10 rounded-2xl border border-[#e5e7eb] bg-[#f8f9fa] px-5 py-4">
            <p className="text-sm text-[#6b7280]">
              Snap a photo, answer 10 quick flags, and get your dating style — powered by AI.
            </p>
          </div>

          <p className="mt-8 text-center text-sm text-[#6b7280]">
            100% anonymous. Nothing is stored.
          </p>
        </div>
      </ScreenWrapper>

      <FixedBottomBar>
        <button type="button" onClick={handleStart} className="btn-primary">
          Start My Scan
        </button>
      </FixedBottomBar>
    </>
  )
}
