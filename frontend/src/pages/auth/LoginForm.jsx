import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

// SVG Icons 

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

// Props
// toggle       — fn()   : switches the parent shell to the sign-up panel
// formVisible  — bool   : drives the .visible animation class
// mode         — string : "sign-in" | "sign-up" — controls transition-delay

export default function LoginForm({ toggle, formVisible, mode }) {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect back to whatever page the user was trying to reach before login.
  const from = location.state?.from?.pathname || null;

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    const result = await login({ email: form.email, password: form.password });

    if (result.success) {
      const destination = from || (result.role === "artist" ? "/artist" : "/home");
      navigate(destination, { replace: true });
    } else {
      setError(result.message);
    }
  };

  const formClass = [
    "auth-form",
    mode === "sign-in" && formVisible ? "visible" : "",
  ].join(" ");

  return (
    <div className="form-wrapper">
      <div
        className={formClass}
        style={{ transitionDelay: mode === "sign-in" ? "0.85s" : "0s" }}
      >
        {/* Logo */}
        <div className="form-logo">
          <div className="form-logo-mark">T</div>
          <span className="form-logo-text">Topify</span>
        </div>

        <h2 className="form-heading">Welcome back</h2>
        <p className="form-subheading">Sign in to continue listening</p>

        <form onSubmit={handleSubmit}>
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
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <div className="form-footer">
          <span className="forgot">Forgot your password?</span>
          Don't have an account?{" "}
          <b onClick={toggle}>Sign up here</b>
        </div>
      </div>
    </div>
  );
}