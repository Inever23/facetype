import { PAYWALL_FEATURES } from '../constants/lockedFeatures'

export default function PaywallModal({ onUnlock, onClose }) {
  return (
    <div className="paywall-overlay screen-enter" role="dialog" aria-modal="true">
      <button
        type="button"
        className="paywall-close"
        onClick={onClose}
        aria-label="Close"
      >
        ✕
      </button>

      <div className="paywall-modal">
        <h2 className="paywall-modal__title">Unlock Your Full Dating Profile</h2>

        <ul className="paywall-features">
          {PAYWALL_FEATURES.map((feature) => (
            <li key={feature} className="paywall-features__item">
              <span className="paywall-features__check">✓</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <button type="button" className="btn-primary mt-8" onClick={onUnlock}>
          Unlock for $1.99
        </button>
      </div>
    </div>
  )
}
