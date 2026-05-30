import confetti from 'canvas-confetti'

const COLORS = ['#4A90D9', '#52C9A0', '#FF6B6B', '#ffffff', '#1a1a2e']

export function fireResultConfetti() {
  const duration = 2800
  const end = Date.now() + duration

  const frame = () => {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 60,
      origin: { x: 0, y: 0.55 },
      colors: COLORS,
      zIndex: 9999,
    })
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 60,
      origin: { x: 1, y: 0.55 },
      colors: COLORS,
      zIndex: 9999,
    })
    if (Date.now() < end) {
      requestAnimationFrame(frame)
    }
  }

  confetti({
    particleCount: 80,
    spread: 100,
    origin: { y: 0.45 },
    colors: COLORS,
    zIndex: 9999,
  })
  frame()
}
