export default function AppShell({ children }) {
  return (
    <div className="flex min-h-[100dvh] w-full justify-center bg-[#f8f9fa]">
      <div className="relative w-full max-w-[430px] min-h-[100dvh]">
        {children}
      </div>
    </div>
  )
}
