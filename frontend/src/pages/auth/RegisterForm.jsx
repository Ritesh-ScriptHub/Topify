import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { resendVerification } from "@/api/auth.api";

// SVG Icons

const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);
const IconLock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

export default function RegisterForm({ toggle, formVisible, mode }) {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [emailSent, setEmailSent] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState("")
  const [resendLoading, setResendLoading] = useState(false)
  const [resendSent, setResendSent] = useState(false)

  // Pre-select "artist" role if the user arrived via an "I'm an Artist" CTA
  // that passed { state: { role: "artist" } } through the Link/navigate call.
  const defaultRole = location.state?.role || "user";

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: defaultRole,
  });
  const [error, setError] = useState(null);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const setRole = (role) =>
    setForm((prev) => ({ ...prev, role }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.username || !form.email || !form.password) {
      setError("All fields are required.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    const result = await register(form);

    if (result.success) {
      // navigate(result.role === "artist" ? "/artist" : "/home", { replace: true });
      setRegisteredEmail(form.email)
      setEmailSent(true)
    } else {
      setError(result.message);
    }
  };

  const handleResend = async () => {
    setResendLoading(true)
    try {
      await resendVerification(registeredEmail)
      setResendSent(true)
    } catch {
      setResendSent(true)
    } finally {
      setResendLoading(false)
    }
  }

  const formClass = [
    "auth-form",
    mode === "sign-up" && formVisible ? "visible" : "",
  ].join(" ");

  // ── Email sent state ──
  if (emailSent) {
    return (
      <div className="form-wrapper">
        <div
          className={formClass}
          style={{ transitionDelay: mode === "sign-up" ? "0.85s" : "0s", textAlign: "center" }}
        >
          <div className="form-logo" style={{ justifyContent: "center" }}>
            <div className="form-logo-mark">T</div>
            <span className="form-logo-text">Topify</span>
          </div>

          <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>📬</div>

          <h2 className="form-heading" style={{ textAlign: "center" }}>
            Check your inbox
          </h2>
          <p className="form-subheading" style={{ textAlign: "center", marginBottom: "1.25rem" }}>
            We sent a verification link to<br />
            <strong style={{ color: "#1a1005" }}>{registeredEmail}</strong>
          </p>

          <p style={{ fontSize: "0.8rem", color: "#8a7860", lineHeight: 1.6, marginBottom: "1.25rem" }}>
            Click the link in the email to activate your account. It expires in 24 hours.
          </p>

          {resendSent ? (
            <p style={{
              fontSize: "0.82rem", color: "#16a34a",
              background: "#f0fdf4", borderRadius: "0.65rem",
              padding: "0.65rem 1rem", marginBottom: "1rem"
            }}>
              ✅ New link sent — check your inbox.
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={resendLoading}
              className="auth-btn"
              style={{ background: "#1a1005", boxShadow: "none" }}
            >
              {resendLoading ? "Sending…" : "Resend verification email"}
            </button>
          )}

          <div className="form-footer">
            Wrong email?{" "}
            <b onClick={() => { setEmailSent(false); setForm({ username: "", email: "", password: "", role: "user" }) }}>
              Start over
            </b>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="form-wrapper">
      <div
        className={formClass}
        style={{ transitionDelay: mode === "sign-up" ? "0.85s" : "0s" }}
      >
        {/* Logo */}
        <div className="form-logo">
          <div className="form-logo-mark">T</div>
          <span className="form-logo-text">Topify</span>
        </div>

        <h2 className="form-heading">Create account</h2>
        <p className="form-subheading">Free forever. No card needed.</p>

        <div className="role-selector">
          {["user", "artist"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`role-btn${form.role === r ? " active" : ""}`}
            >
              {r === "user" ? "🎧 Listener" : "🎙️ Artist"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <IconUser />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <IconMail />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <IconLock />
            <input
              type="password"
              name="password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading
              ? "Creating account…"
              : `Join as ${form.role === "artist" ? "Artist" : "Listener"}`}
          </button>
        </form>

        <div className="form-footer">
          Already have an account?{" "}
          <b onClick={toggle}>Sign in here</b>
        </div>
      </div>
    </div>
  );
}