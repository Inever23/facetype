export default function CardSkeleton({ lines = 4 }) {
  return (
    <div className="card-skeleton card p-5" aria-hidden>
      <div className="card-skeleton__line card-skeleton__line--short" />
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className={`card-skeleton__line ${i === lines - 1 ? 'card-skeleton__line--medium' : ''}`}
        />
      ))}
    </div>
  )
}
