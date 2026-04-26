import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/useAuth"

export default function Login() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // redirect back to where they came from, or role-based default
  const from = location.state?.from?.pathname || null

  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState(null)

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!form.email || !form.password) {
      setError("Please fill in all fields.")
      return
    }

    const result = await login({ email: form.email, password: form.password })

    if (result.success) {
      const destination = from || (result.role === "artist" ? "/artist" : "/home")
      navigate(destination, { replace: true })
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
        {/* Decorative circles */}
        <div
          className="absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-10"
          style={{ backgroundColor: "var(--amber)" }}
        />
        <div
          className="absolute bottom-20 -right-16 w-96 h-96 rounded-full opacity-10"
          style={{ backgroundColor: "var(--amber)" }}
        />

        {/* Logo */}
        <Link to="/">
          <span
            className="font-display text-2xl font-semibold"
            style={{ color: "var(--cream)" }}
          >
            Topify
          </span>
        </Link>

        {/* Central quote */}
        <div className="relative z-10">
          <p
            className="font-display text-4xl font-light italic leading-snug mb-6"
            style={{ color: "var(--cream)" }}
          >
            "Music gives a soul to the universe, wings to the mind."
          </p>
          <p className="text-sm" style={{ color: "#A8A29E" }}>
            — Plato
          </p>
        </div>

        {/* Bottom note */}
        <p className="text-xs" style={{ color: "#78716C" }}>
          Your music, your world.
        </p>
      </div>

      {/* ── Right: Form panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">

        {/* Mobile logo */}
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
              Welcome back
            </h1>
            <p className="text-sm" style={{ color: "var(--charcoal-muted)" }}>
              Sign in to continue listening
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 anim-fade-up anim-delay-2">

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
                placeholder="••••••••"
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
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </form>

          <p
            className="anim-fade-up anim-delay-3 text-sm text-center mt-8"
            style={{ color: "var(--charcoal-muted)" }}
          >
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium underline underline-offset-4 hover:opacity-70 transition-opacity"
              style={{ color: "var(--charcoal)" }}
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}