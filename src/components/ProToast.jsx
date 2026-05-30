export default function ProToast({ visible }) {
  if (!visible) return null

  return (
    <div className="pro-toast screen-enter" role="status" aria-live="polite">
      Pro unlocked! ✓
    </div>
  )
}
