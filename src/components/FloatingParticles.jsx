import { useMemo } from 'react'

function createParticles(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: 1 + Math.random() * 2.5,
    opacity: 0.15 + Math.random() * 0.45,
    duration: 18 + Math.random() * 22,
    delay: Math.random() * -30,
    driftX: -30 + Math.random() * 60,
    driftY: -80 - Math.random() * 120,
    tint: Math.random() > 0.6 ? 'burgundy' : 'warm',
  }))
}

export default function FloatingParticles({ count = 28 }) {
  const particles = useMemo(() => createParticles(count), [count])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(139,26,26,0.12),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,rgba(139,26,26,0.08),transparent_50%)]" />
      {particles.map((p) => (
        <span
          key={p.id}
          className={`particle particle--${p.tint}`}
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            '--drift-x': `${p.driftX}px`,
            '--drift-y': `${p.driftY}px`,
            '--float-duration': `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
