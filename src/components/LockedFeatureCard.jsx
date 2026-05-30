export default function LockedFeatureCard({ emoji, title, description }) {
  return (
    <div className="locked-feature-card">
      <span className="locked-feature-card__lock" aria-hidden>
        🔒
      </span>
      <div className="locked-feature-card__overlay" aria-hidden />
      <div className="locked-feature-card__content">
        <p className="locked-feature-card__title">
          {emoji} {title}
        </p>
        <p className="locked-feature-card__desc">{description}</p>
      </div>
    </div>
  )
}
