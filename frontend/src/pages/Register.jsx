import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/useAuth"

export default function Register() {
  const { register, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // pre-select artist role if coming from "I'm an Artist" button on Landing
  const defaultRole = location.state?.role || "user"

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: defaultRole,
  })
  const [error, setError] = useState(null)

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const setRole = (role) =>
    setForm((prev) => ({ ...prev, role }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!form.username || !form.email || !form.password) {
      setError("All fields are required.")
      return
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    const result = await register(form)

    if (result.success) {
      navigate(result.role === "artist" ? "/artist" : "/home", { replace: true })
    } else {
      setError(result.message)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "var(--cream)" }}>

      {/* ── Left: Brand panel ── */}
      <div
        className="hidden lg:flex lg:w-5/12 flex-col justify-between p-12 relative overflow-hidden"
        style={{ backgroundColor: "var(--charcoal)" }}
      >
        <div
          className="absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-10"
          style={{ backgroundColor: "var(--amber)" }}
        />
        <div
          className="absolute bottom-20 -right-16 w-96 h-96 rounded-full opacity-10"
          style={{ backgroundColor: "var(--amber)" }}
        />

        <Link to="/">
          <span
            className="font-display text-2xl font-semibold"
            style={{ color: "var(--cream)" }}
          >
            Topify
          </span>
        </Link>

        <div className="relative z-10 space-y-8">
          {[
            { icon: "🎵", text: "Stream unlimited tracks from independent artists" },
            { icon: "📀", text: "Explore full album experiences, not just singles" },
            { icon: "🎙️", text: "Upload and publish your own music as an artist" },
          ].map((item) => (
            <div key={item.text} className="flex items-start gap-4">
              <span className="text-2xl">{item.icon}</span>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "#A8A29E" }}
              >
                {item.text}
              </p>
            </div>
          ))}
        </div>

        <p className="text-xs" style={{ color: "#78716C" }}>
          Your music, your world.
        </p>
      </div>

      {/* ── Right: Form panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">

        <Link to="/" className="lg:hidden mb-10">
          <span
            className="font-display text-2xl font-semibold"
            style={{ color: "var(--charcoal)" }}
          >
            Topify
          </span>
        </Link>

        <div className="w-full max-w-sm">
          <div className="anim-fade-up anim-delay-1 mb-8">
            <h1
              className="font-display text-3xl font-semibold mb-2"
              style={{ color: "var(--charcoal)" }}
            >
              Create account
            </h1>
            <p className="text-sm" style={{ color: "var(--charcoal-muted)" }}>
              Free forever. No card needed.
            </p>
          </div>

          {/* Role selector */}
          <div className="anim-fade-up anim-delay-2 flex gap-3 mb-6">
            {["user", "artist"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium capitalize transition-all"
                style={{
                  backgroundColor: form.role === r ? "var(--charcoal)" : "var(--cream-dark)",
                  color: form.role === r ? "var(--cream)" : "var(--charcoal-muted)",
                  border: `1px solid ${form.role === r ? "var(--charcoal)" : "var(--border)"}`,
                }}
              >
                {r === "user" ? "🎧 Listener" : "🎙️ Artist"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 anim-fade-up anim-delay-3">

            <div className="space-y-1.5">
              <Label
                htmlFor="username"
                className="text-sm font-medium"
                style={{ color: "var(--charcoal)" }}
              >
                Username
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="yourname"
                value={form.username}
                onChange={handleChange}
                className="rounded-xl h-11 text-sm"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                  fontFamily: "'Outfit', sans-serif",
                }}
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-sm font-medium"
                style={{ color: "var(--charcoal)" }}
              >
                Email address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className="rounded-xl h-11 text-sm"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                  fontFamily: "'Outfit', sans-serif",
                }}
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-sm font-medium"
                style={{ color: "var(--charcoal)" }}
              >
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                className="rounded-xl h-11 text-sm"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                  fontFamily: "'Outfit', sans-serif",
                }}
              />
            </div>

            {error && (
              <div
                className="rounded-xl px-4 py-3 text-sm"
                style={{
                  backgroundColor: "#FEF2F2",
                  color: "#DC2626",
                  border: "1px solid #FECACA",
                }}
              >
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl h-11 text-sm font-medium hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: "var(--amber)",
                color: "#fff",
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              {loading ? "Creating account…" : `Join as ${form.role === "artist" ? "Artist" : "Listener"}`}
            </Button>
          </form>

          <p
            className="anim-fade-up anim-delay-4 text-sm text-center mt-8"
            style={{ color: "var(--charcoal-muted)" }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium underline underline-offset-4 hover:opacity-70 transition-opacity"
              style={{ color: "var(--charcoal)" }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}