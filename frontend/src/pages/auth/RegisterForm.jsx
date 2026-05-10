import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

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
      navigate(result.role === "artist" ? "/artist" : "/home", { replace: true });
    } else {
      setError(result.message);
    }
  };

  const formClass = [
    "auth-form",
    mode === "sign-up" && formVisible ? "visible" : "",
  ].join(" ");

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