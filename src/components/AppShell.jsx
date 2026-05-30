export default function AppShell({ children }) {
  return (
    <div className="flex min-h-full w-full justify-center bg-[#0a0a0a]">
      <div className="relative flex min-h-full w-full max-w-[430px] flex-col overflow-hidden">
        {children}
      </div>
    </div>
  )
}
