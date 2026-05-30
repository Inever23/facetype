import { useEffect, useRef, useState } from 'react'
import { SCAN_MESSAGES } from '../constants/questions'
import { startScanBeeps, stopScanBeeps } from '../utils/scanAudio'

const SCAN_DURATION_MS = 4000
const MESSAGE_INTERVAL_MS = 1200

export default function FaceScan({ onComplete }) {
  const videoRef = useRef(null)
  const [cameraDenied, setCameraDenied] = useState(false)
  const [retryKey, setRetryKey] = useState(0)
  const [messageIndex, setMessageIndex] = useState(0)
  const [displayIndex, setDisplayIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [messageVisible, setMessageVisible] = useState(true)

  useEffect(() => {
    let stream = null
    let cancelled = false

    async function initCamera() {
      setCameraDenied(false)
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        })
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch {
        if (!cancelled) setCameraDenied(true)
      }
    }

    initCamera()

    return () => {
      cancelled = true
      stream?.getTracks().forEach((t) => t.stop())
    }
  }, [retryKey])

  useEffect(() => {
    if (messageIndex === displayIndex) return
    setMessageVisible(false)
    const t = setTimeout(() => {
      setDisplayIndex(messageIndex)
      setMessageVisible(true)
    }, 220)
    return () => clearTimeout(t)
  }, [messageIndex, displayIndex])

  useEffect(() => {
    if (cameraDenied) return

    let completed = false
    startScanBeeps()

    const start = performance.now()
    let rafId

    const easeOutCubic = (t) => 1 - (1 - t) ** 3

    const tick = (now) => {
      const elapsed = now - start
      const raw = Math.min(1, elapsed / SCAN_DURATION_MS)
      setProgress(easeOutCubic(raw) * 100)

      if (elapsed >= SCAN_DURATION_MS) {
        if (!completed) {
          completed = true
          stopScanBeeps()
          onComplete()
        }
        return
      }
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)

    const msgInterval = setInterval(() => {
      setMessageIndex((i) => Math.min(i + 1, SCAN_MESSAGES.length - 1))
    }, MESSAGE_INTERVAL_MS)

    return () => {
      cancelAnimationFrame(rafId)
      clearInterval(msgInterval)
      stopScanBeeps()
    }
  }, [cameraDenied, onComplete, retryKey])

  if (cameraDenied) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center px-8 text-center">
        <p className="text-lg text-[#f5f0eb]">Camera access needed for the scan</p>
        <button
          type="button"
          onClick={() => setRetryKey((k) => k + 1)}
          className="btn-premium mt-8 rounded-2xl px-8 py-4 font-bold text-[#f5f0eb]"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="relative min-h-full w-full overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 h-full w-full scale-x-[-1] object-cover"
      />

      <div className="scan-vignette absolute inset-0" />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 flex min-h-full flex-col px-6 py-10">
        <div className="relative h-8">
          <p
            className={`scan-status text-center text-sm font-medium tracking-wide text-[#f5f0eb]/95 ${
              messageVisible ? 'scan-status--visible' : 'scan-status--hidden'
            }`}
          >
            {SCAN_MESSAGES[displayIndex]}
          </p>
        </div>

        <div className="relative mt-6 flex flex-1 items-center justify-center">
          <div className="scan-oval scan-oval--outer" />
          <div className="scan-oval scan-oval--inner" />

          <div className="scan-line scan-line--a" />
          <div className="scan-line scan-line--b" />
          <div className="scan-line-glow scan-line-glow--a" aria-hidden />
          <div className="scan-line-glow scan-line-glow--b" aria-hidden />
        </div>

        <div className="mt-auto">
          <div className="scan-progress-track">
            <div className="scan-progress-fill" style={{ width: `${progress}%` }} />
            <div className="scan-progress-shimmer" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
    </div>
  )
}
