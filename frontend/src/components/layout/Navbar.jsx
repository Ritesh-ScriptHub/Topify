import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
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
  const location = useLocation()
  const navigate = useNavigate()

  const navLinks = isArtist ? ARTIST_NAV : USER_NAV

  const handleLogout = async () => {
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