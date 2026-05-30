let audioCtx = null
let beepInterval = null

function getContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioCtx
}

function playBeep() {
  const ctx = getContext()
  if (ctx.state === 'suspended') {
    ctx.resume()
  }

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = 'sine'
  osc.frequency.setValueAtTime(880, ctx.currentTime)
  gain.gain.setValueAtTime(0.04, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12)

  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.12)
}

export function startScanBeeps() {
  stopScanBeeps()
  playBeep()
  beepInterval = setInterval(playBeep, 600)
}

export function stopScanBeeps() {
  if (beepInterval) {
    clearInterval(beepInterval)
    beepInterval = null
  }
}

export function resumeAudioContext() {
  const ctx = getContext()
  if (ctx.state === 'suspended') {
    ctx.resume()
  }
}
