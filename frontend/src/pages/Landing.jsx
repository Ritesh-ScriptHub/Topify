import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"

const FEATURES = [
  {
    icon: "🎵",
    title: "Unlimited Tracks",
    desc: "Stream every song from every artist on the platform, any time.",
  },
  {
    icon: "📀",
    title: "Curated Albums",
    desc: "Artists craft full album experiences — not just singles.",
  },
  {
    icon: "🎙️",
    title: "Artist Tools",
    desc: "Upload, organise and publish your music to a real audience.",
  },
]

export default function Landing() {
  const { isAuthenticated, isArtist } = useAuth()

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--cream)" }}>

      {/* ── Navbar ── */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
        <span
          className="font-display text-2xl font-semibold tracking-tight"
          style={{ color: "var(--charcoal)" }}
        >
          Topify
        </span>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link to={isArtist ? "/artist" : "/home"}>
              <Button
                style={{
                  backgroundColor: "var(--amber)",
                  color: "#fff",
                  fontFamily: "'Outfit', sans-serif",
                }}
                className="rounded-full px-6 hover:opacity-90 transition-opacity"
              >
                Go to App →
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button
                  variant="ghost"
                  style={{ color: "var(--charcoal-muted)", fontFamily: "'Outfit', sans-serif" }}
                  className="rounded-full px-5"
                >
                  Sign in
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  style={{
                    backgroundColor: "var(--charcoal)",
                    color: "var(--cream)",
                    fontFamily: "'Outfit', sans-serif",
                  }}
                  className="rounded-full px-6 hover:opacity-85 transition-opacity"
                >
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-7xl mx-auto px-8 pt-16 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* Left: copy */}
        <div>
          {/* <div
            className="anim-fade-up anim-delay-1 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-8"
            style={{
              backgroundColor: "var(--amber-pale)",
              color: "var(--amber)",
              border: "1px solid #F5A36A55",
            }}
          >
            🎧 Music for every mood
          </div> */}

          <h1
            className="anim-fade-up anim-delay-2 font-display text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight mb-6"
            style={{ color: "var(--charcoal)" }}
          >
            Where artists{" "}
            <span className="italic font-light" style={{ color: "var(--amber)" }}>
              share
            </span>
            ,<br />
            listeners{" "}
            <span className="italic font-light" style={{ color: "var(--amber)" }}>
              discover.
            </span>
          </h1>

          <p
            className="anim-fade-up anim-delay-3 text-lg leading-relaxed max-w-md mb-10"
            style={{ color: "var(--charcoal-muted)" }}
          >
            Topify connects independent artists with listeners who actually care.
            Upload your craft. Find your sound. No algorithms hiding you.
          </p>

          <div className="anim-fade-up anim-delay-4 flex items-center gap-4 flex-wrap">
            <Link to="/register">
              <Button
                size="lg"
                className="rounded-full px-8 text-base hover:opacity-90 transition-all hover:scale-[1.02]"
                style={{
                  backgroundColor: "var(--amber)",
                  color: "#fff",
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                Start Listening Free
              </Button>
            </Link>
            <Link to="/register" state={{ role: "artist" }}>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-8 text-base transition-all hover:scale-[1.02]"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--charcoal)",
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                I'm an Artist →
              </Button>
            </Link>
          </div>

          {/* Social proof */}
          <p
            className="anim-fade-up anim-delay-5 text-sm mt-8"
            style={{ color: "var(--charcoal-muted)" }}
          >
            Free forever · No credit card needed · Join in 30 seconds
          </p>
        </div>

        {/* Right: decorative visual */}
        <div className="anim-fade-up anim-delay-3 relative flex items-center justify-center h-80 lg:h-[460px]">
          {/* Background blob */}
          <div
            className="absolute w-72 h-72 lg:w-96 lg:h-96 rounded-full blur-3xl opacity-30"
            style={{ backgroundColor: "var(--amber)" }}
          />

          {/* Mock "now playing" card */}
          <div
            className="relative z-10 rounded-2xl p-6 w-72 shadow-2xl"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            {/* Album art placeholder */}
            <div
              className="w-full h-44 rounded-xl mb-4 flex items-center justify-center text-5xl"
              style={{ backgroundColor: "var(--cream-dark)" }}
            >
              🎵
            </div>

            <div className="mb-4">
              <p className="font-semibold text-base" style={{ color: "var(--charcoal)" }}>
                Late Night Drive
              </p>
              <p className="text-sm" style={{ color: "var(--charcoal-muted)" }}>
                The Weekend Artist
              </p>
            </div>

            {/* Fake waveform */}
            <div className="flex items-end gap-1 h-8 mb-4">
              {[4, 7, 5, 9, 6, 11, 8, 5, 10, 7, 4, 8, 6, 10, 5].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-full transition-all"
                  style={{
                    height: `${h * 2.5}px`,
                    backgroundColor: i < 8 ? "var(--amber)" : "var(--cream-dark)",
                  }}
                />
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: "var(--charcoal-muted)" }}>1:24</span>
              <button
                className="w-10 h-10 rounded-full flex items-center justify-center text-black text-sm"
                style={{ backgroundColor: "var(--charcoal)" }}
              >
                ▶
              </button>
              <span className="text-xs" style={{ color: "var(--charcoal-muted)" }}>3:47</span>
            </div>
          </div>

          {/* Floating badge */}
          {/* <div
            className="absolute top-6 right-4 lg:right-0 rounded-xl px-4 py-2 text-sm font-medium shadow-lg"
            style={{
              backgroundColor: "var(--charcoal)",
              color: "var(--cream)",
            }}
          >
            🔥 Trending Now
          </div> */}
        </div>
      </section>

      {/* ── Features ── */}
      <section
        className="py-20 px-8"
        style={{ backgroundColor: "var(--cream-dark)" }}
      >
        <div className="max-w-7xl mx-auto">
          <h2
            className="font-display text-4xl font-semibold text-center mb-3"
            style={{ color: "var(--charcoal)" }}
          >
            Everything you need
          </h2>
          <p
            className="text-center mb-14"
            style={{ color: "var(--charcoal-muted)" }}
          >
            Built for listeners and artists alike.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl p-8 transition-all hover:-translate-y-1 hover:shadow-lg"
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3
                  className="font-display text-xl font-medium mb-2"
                  style={{ color: "var(--charcoal)" }}
                >
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--charcoal-muted)" }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-24 px-8 text-center">
        <div className="max-w-2xl mx-auto">
          <h2
            className="font-display text-5xl font-semibold mb-5"
            style={{ color: "var(--charcoal)" }}
          >
            Ready to{" "}
            <span className="italic font-light" style={{ color: "var(--amber)" }}>
              tune in?
            </span>
          </h2>
          <p className="mb-8" style={{ color: "var(--charcoal-muted)" }}>
            Join Topify and experience music without the noise.
          </p>
          <Link to="/register">
            <Button
              size="lg"
              className="rounded-full px-10 text-base hover:opacity-90 transition-all hover:scale-[1.02]"
              style={{
                backgroundColor: "var(--amber)",
                color: "#fff",
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              Create Your Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="px-8 py-6 text-center text-sm"
        style={{
          borderTop: "1px solid var(--border)",
          color: "var(--charcoal-muted)",
        }}
      >
        © {new Date().getFullYear()} Topify · Built for music lovers
      </footer>
    </div>
  )
}