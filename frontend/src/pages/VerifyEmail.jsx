import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { verifyEmail, resendVerification } from "@/api/auth.api"

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get("token")

  const [status, setStatus] = useState("loading") // loading | success | error | expired
  const [resendEmail, setResendEmail] = useState("")
  const [resendSent, setResendSent] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    if (!token) {
      setStatus("error")
      return
    }

    async function verify() {
      try {
        await verifyEmail(token)
        setStatus("success")
      } catch (err) {
        setStatus(err.message?.includes("expired") ? "expired" : "error")
      }
    }
    verify()
  }, [token])

  // Auto-redirect to login after success
  useEffect(() => {
    if (status !== "success") return
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval)
          navigate("/login", { state: { verified: true } })
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [status, navigate])

  const handleResend = async (e) => {
    e.preventDefault()
    if (!resendEmail) return
    setResendLoading(true)
    try {
      await resendVerification(resendEmail)
      setResendSent(true)
    } catch (err) {
      setResendSent(true) // show generic message regardless
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0d0905",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800&family=DM+Sans:wght@400;500&display=swap');`}</style>

      <div style={{
        background: "#fff",
        borderRadius: "1.75rem",
        padding: "2.5rem 2rem",
        maxWidth: "420px",
        width: "100%",
        textAlign: "center",
        boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
      }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "1.75rem" }}>
          <div style={{
            width: 32, height: 32,
            background: "#EF9F27",
            borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 800,
            color: "#633806",
            fontFamily: "'Outfit', sans-serif",
          }}>T</div>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#1a1005" }}>
            Topify
          </span>
        </div>

        {/* ── Loading ── */}
        {status === "loading" && (
          <>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⏳</div>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.4rem", fontWeight: 700, color: "#1a1005", marginBottom: "0.5rem" }}>
              Verifying your email
            </h2>
            <p style={{ fontSize: "0.875rem", color: "#8a7860" }}>
              Just a moment…
            </p>
          </>
        )}

        {/* ── Success ── */}
        {status === "success" && (
          <>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎉</div>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.4rem", fontWeight: 700, color: "#1a1005", marginBottom: "0.5rem" }}>
              Email verified!
            </h2>
            <p style={{ fontSize: "0.875rem", color: "#8a7860", marginBottom: "1.5rem", lineHeight: 1.6 }}>
              Your account is now active. Redirecting to login in{" "}
              <strong style={{ color: "#EF9F27" }}>{countdown}s</strong>…
            </p>
            <button
              onClick={() => navigate("/login", { state: { verified: true } })}
              style={{
                padding: "0.75rem 2rem",
                background: "linear-gradient(135deg, #EF9F27, #BA7517)",
                color: "#fff",
                border: "none",
                borderRadius: "0.65rem",
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 600,
                fontSize: "0.95rem",
                cursor: "pointer",
              }}
            >
              Go to Login
            </button>
          </>
        )}

        {/* ── Expired ── */}
        {status === "expired" && (
          <>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⏰</div>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.4rem", fontWeight: 700, color: "#1a1005", marginBottom: "0.5rem" }}>
              Link expired
            </h2>
            <p style={{ fontSize: "0.875rem", color: "#8a7860", marginBottom: "1.5rem", lineHeight: 1.6 }}>
              Verification links expire after 24 hours. Enter your email to get a new one.
            </p>

            {resendSent ? (
              <p style={{ fontSize: "0.875rem", color: "#16a34a", background: "#f0fdf4", borderRadius: "0.65rem", padding: "0.75rem 1rem" }}>
                ✅ New verification link sent — check your inbox.
              </p>
            ) : (
              <form onSubmit={handleResend} style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  required
                  style={{
                    flex: 1,
                    padding: "0.7rem 1rem",
                    border: "1.5px solid #ede0cc",
                    borderRadius: "0.65rem",
                    fontSize: "0.875rem",
                    fontFamily: "'DM Sans', sans-serif",
                    outline: "none",
                    background: "#fdf8f1",
                    color: "#1a1005",
                  }}
                />
                <button
                  type="submit"
                  disabled={resendLoading}
                  style={{
                    padding: "0.7rem 1.25rem",
                    background: "linear-gradient(135deg, #EF9F27, #BA7517)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "0.65rem",
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {resendLoading ? "Sending…" : "Resend"}
                </button>
              </form>
            )}
          </>
        )}

        {/* ── Invalid ── */}
        {status === "error" && (
          <>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>❌</div>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.4rem", fontWeight: 700, color: "#1a1005", marginBottom: "0.5rem" }}>
              Invalid link
            </h2>
            <p style={{ fontSize: "0.875rem", color: "#8a7860", marginBottom: "1.5rem", lineHeight: 1.6 }}>
              This verification link is invalid. Make sure you copied the full URL from your email.
            </p>
            <button
              onClick={() => navigate("/login")}
              style={{
                padding: "0.75rem 2rem",
                background: "#1a1005",
                color: "#fff",
                border: "none",
                borderRadius: "0.65rem",
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 600,
                fontSize: "0.95rem",
                cursor: "pointer",
              }}
            >
              Back to Login
            </button>
          </>
        )}

      </div>
    </div>
  )
}