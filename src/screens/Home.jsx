import FloatingParticles from '../components/FloatingParticles'
import { resumeAudioContext } from '../utils/scanAudio'

export default function Home({ onStart }) {
  const handleStart = () => {
    resumeAudioContext()
    onStart()
  }

  return (
    <div className="relative flex min-h-full flex-col justify-center overflow-hidden px-8 py-12">
      <FloatingParticles />

      <div className="relative z-10">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#8b1a1a]/90">
          Dating personality
        </p>
        <h1 className="mt-3 bg-gradient-to-b from-[#faf6f2] to-[#f5f0eb]/75 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent">
          FaceType
        </h1>
        <p className="mt-5 text-xl font-semibold leading-snug text-[#f5f0eb]/95">
          Your face reveals how you love.
        </p>
        <p className="mt-3 text-base leading-relaxed text-[#9a9a9a]">
          Takes 60 seconds. Uncomfortably accurate.
        </p>

        <button
          type="button"
          onClick={handleStart}
          className="btn-premium mt-14 w-full rounded-2xl py-5 text-lg font-bold text-[#f5f0eb]"
        >
          Start My Scan
        </button>

        <p className="mt-6 text-center text-sm tracking-wide text-[#9a9a9a]/90">
          100% anonymous. Nothing is stored.
        </p>
      </div>
    </div>
  )
}
