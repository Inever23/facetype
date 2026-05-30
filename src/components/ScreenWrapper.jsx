export default function ScreenWrapper({
  children,
  dark = false,
  hasFixedFooter = false,
  className = '',
}) {
  return (
    <div
      className={`screen-scroll ${dark ? 'screen-scroll--dark' : ''} ${
        hasFixedFooter ? 'screen-scroll--footer' : ''
      } ${className}`.trim()}
    >
      {children}
    </div>
  )
}
