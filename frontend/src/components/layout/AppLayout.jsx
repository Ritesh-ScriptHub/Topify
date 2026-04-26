import Navbar from "./Navbar"
import PlayerBar from "./PlayerBar"

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--cream)" }}>
      <Navbar />

      {/* main content — top padding for fixed navbar, bottom for fixed player */}
      <main className="flex-1 pt-[68px] pb-[96px]">
        {children}
      </main>

      <PlayerBar />
    </div>
  )
}