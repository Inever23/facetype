export default function FixedBottomBar({ children, dark = false }) {
  return (
    <div className={`fixed-bottom-bar ${dark ? 'fixed-bottom-bar--dark' : ''}`}>
      <div className="fixed-bottom-bar__inner">{children}</div>
    </div>
  )
}
