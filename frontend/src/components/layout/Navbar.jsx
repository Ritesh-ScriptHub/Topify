import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { useTheme } from "@/hooks/useTheme" 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { usePlayer } from "@/hooks/usePlayer"

const USER_NAV = [
  { label: "Home", to: "/home" },
  { label: "Albums", to: "/albums" },
]

const ARTIST_NAV = [
  { label: "Dashboard", to: "/artist" },
  { label: "Upload", to: "/artist/upload" },
  { label: "Create Album", to: "/artist/create-album" },
]

export default function Navbar() {
  const { user, logout, isArtist } = useAuth()
  const { theme, toggleTheme } = useTheme() 
  const location = useLocation()
  const navigate = useNavigate()

  const navLinks = isArtist ? ARTIST_NAV : USER_NAV

  const { stopTrack } = usePlayer()

  const handleLogout = async () => {
    stopTrack()
    await logout()
    navigate("/", { replace: true })
  }

  const isActive = (path) => location.pathname === path

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-[68px]"
      style={{
        backgroundColor: "var(--cream)",
        borderBottom: "1px solid var(--border)",
        // subtle backdrop blur so content scrolling under looks clean
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        backgroundColor: "rgba(248,246,241,0.92)",
      }}
    >
      {/* Dark mode bg override — inline style can't use CSS vars in rgba easily */}
      <style>{
        `html.dark header {
          background-color: rgba(28, 25, 23, 0.92) !important;
        }`
      }</style>

      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between gap-6">

        {/* ── Logo ── */}
        <Link
          to={isArtist ? "/artist" : "/home"}
          className="font-display text-xl font-semibold shrink-0 hover:opacity-75 transition-opacity"
          style={{ color: "var(--charcoal)" }}
        >
          Topify
        </Link>

        {/* ── Desktop Nav Links ── */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="relative px-4 py-2 text-sm font-medium rounded-full transition-colors hover:opacity-75"
              style={{
                color: isActive(link.to) ? "var(--charcoal)" : "var(--charcoal-muted)",
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              {link.label}
              {/* Active indicator dot */}
              {isActive(link.to) && (
                <span
                  className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{ backgroundColor: "var(--amber)" }}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* ── Right: Role badge + Avatar dropdown ── */}
        <div className="flex items-center gap-3">

          {/* Role pill — desktop only */}
          <span
            className="hidden md:inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: isArtist ? "var(--amber-pale)" : "var(--cream-dark)",
              color: isArtist ? "var(--amber)" : "var(--charcoal-muted)",
              border: `1px solid ${isArtist ? "#F5A36A55" : "var(--border)"}`,
            }}
          >
            {isArtist ? "🎙️ Artist" : "🎧 Listener"}
          </span>

          {/* ── Theme toggle ── */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-9 h-9 flex items-center justify-center rounded-full transition-all hover:opacity-75"
            style={{
              backgroundColor: "var(--cream-dark)",
              border: "1px solid var(--border)",
              color: "var(--charcoal-muted)",
            }}
          >
            {theme === "dark" ? (
              // Sun icon
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z" />
              </svg>
            ) : (
              // Moon icon
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z" />
              </svg>
            )}
          </button>

          {/* Avatar dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="outline-none focus:outline-none">
                <Avatar
                  className="w-9 h-9 cursor-pointer hover:ring-2 transition-all"
                  style={{ "--tw-ring-color": "var(--amber)" }}
                >
                  <AvatarFallback
                    className="text-sm font-semibold"
                    style={{
                      backgroundColor: "var(--charcoal)",
                      color: "var(--cream)",
                      fontFamily: "'Outfit', sans-serif",
                    }}
                  >
                    {user?.username?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-52 rounded-xl"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              {/* User info header */}
              <div className="px-3 py-2.5">
                <p
                  className="text-sm font-semibold truncate"
                  style={{ color: "var(--charcoal)" }}
                >
                  {user?.username}
                </p>
                <p
                  className="text-xs truncate"
                  style={{ color: "var(--charcoal-muted)" }}
                >
                  {user?.email}
                </p>
              </div>

              <DropdownMenuSeparator style={{ backgroundColor: "var(--border)" }} />

              {/* Nav links inside dropdown on mobile */}
              <div className="md:hidden">
                {navLinks.map((link) => (
                  <DropdownMenuItem key={link.to} asChild>
                    <Link
                      to={link.to}
                      className="cursor-pointer text-sm"
                      style={{ color: "var(--charcoal)" }}
                    >
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator style={{ backgroundColor: "var(--border)" }} />
              </div>

              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-sm"
                style={{ color: "#DC2626" }}
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}