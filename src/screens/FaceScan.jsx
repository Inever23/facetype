import { useCallback, useEffect, useRef, useState } from 'react'
import { SCAN_MESSAGES } from '../constants/questions'
import FixedBottomBar from '../components/FixedBottomBar'
import ScreenWrapper from '../components/ScreenWrapper'
import { startScanBeeps, stopScanBeeps } from '../utils/scanAudio'

const SCAN_DURATION_MS = 4000
const MESSAGE_INTERVAL_MS = 1200

export default function FaceScan({ onComplete }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  const [stage, setStage] = useState('capture')
  const [photoUrl, setPhotoUrl] = useState(null)
  const [cameraDenied, setCameraDenied] = useState(false)
  const [retryKey, setRetryKey] = useState(0)
  const [messageIndex, setMessageIndex] = useState(0)
  const [displayIndex, setDisplayIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [messageVisible, setMessageVisible] = useState(true)

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }, [])

  useEffect(() => {
    if (stage !== 'capture') return

    let cancelled = false

    async function initCamera() {
      setCameraDenied(false)
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        })
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        streamRef.current = stream
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
      stopStream()
    }
  }, [retryKey, stage, stopStream])

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
    if (stage !== 'scan') return

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
  }, [stage, onComplete])

  const handleTakePhoto = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || !video.videoWidth) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.translate(canvas.width, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    setPhotoUrl(canvas.toDataURL('image/jpeg', 0.9))
    stopStream()
    setStage('scan')
    setMessageIndex(0)
    setDisplayIndex(0)
    setProgress(0)
    setMessageVisible(true)
  }

  if (cameraDenied) {
    return (
      <ScreenWrapper dark className="flex flex-col items-center justify-center px-8 text-center">
        <p className="text-lg text-white">Camera access needed for the scan</p>
        <button
          type="button"
          onClick={() => {
            setStage('capture')
            setPhotoUrl(null)
            setRetryKey((k) => k + 1)
          }}
          className="btn-primary mt-8 max-w-xs"
        >
          Retry
        </button>
      </ScreenWrapper>
    )
  }

  if (stage === 'capture') {
    return (
      <div className="screen-scroll--dark relative min-h-[100dvh] w-full overflow-hidden">
        <canvas ref={canvasRef} className="hidden" aria-hidden />

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 h-full w-full scale-x-[-1] object-cover"
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 flex min-h-[100dvh] flex-col px-6 pt-12">
          <p className="text-center text-sm font-medium text-white/95">
            Position your face in the circle
          </p>

          <div className="relative mt-8 flex flex-1 items-center justify-center">
            <div className="face-guide" aria-hidden />
          </div>
        </div>

        <FixedBottomBar dark>
          <button type="button" onClick={handleTakePhoto} className="btn-primary">
            Take Photo
          </button>
        </FixedBottomBar>
      </div>
    )
  }

  return (
    <div className="screen-scroll--dark relative min-h-[100dvh] w-full overflow-hidden">
      <img
        src={photoUrl}
        alt="Your captured face"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="scan-vignette absolute inset-0" />
      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-10 flex min-h-[100dvh] flex-col px-6 py-10 pb-8">
        <div className="relative h-8">
          <p
            className={`scan-status text-center text-sm font-medium tracking-wide text-white/95 ${
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

        <div className="mt-auto pt-4">
          <div className="scan-progress-track">
            <div className="scan-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
    </div>
  )
}
