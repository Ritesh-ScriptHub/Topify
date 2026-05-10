import { useState, useEffect } from "react";
import { authStyles } from "./AuthStyles";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

// Decorative SVG Graphics

const WelcomeGraphic = () => (
  <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="70" cy="70" r="60" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
    <circle cx="70" cy="52" r="18" fill="rgba(255,255,255,0.9)"/>
    <path d="M36 104c0-18.78 15.22-34 34-34s34 15.22 34 34" fill="rgba(255,255,255,0.9)"/>
    <circle cx="70" cy="52" r="18" fill="rgba(255,255,255,0.9)"/>
    <path d="M57 52a13 13 0 1 1 26 0 13 13 0 0 1-26 0Z" fill="#EF9F27"/>
    <path d="M38 108a32 32 0 0 1 64 0" stroke="rgba(255,255,255,0.9)" strokeWidth="0" fill="rgba(255,255,255,0.9)"/>
  </svg>
);

const JoinGraphic = () => (
  <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="70" cy="70" r="60" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
    <path d="M70 36v68M36 70h68" stroke="rgba(255,255,255,0.9)" strokeWidth="8" strokeLinecap="round"/>
    <circle cx="70" cy="70" r="28" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" fill="none"/>
  </svg>
);

export default function LoginSignup() {
  const [mode, setMode] = useState(null);
  const [formVisible, setFormVisible] = useState(false);

  // Boot sequence: slide blob in, then pop forms up
  useEffect(() => {
    const t1 = setTimeout(() => setMode("sign-in"), 200);
    const t2 = setTimeout(() => setFormVisible(true), 400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Animate out → swap panel → animate in
  const toggle = () => {
    setFormVisible(false);
    setTimeout(() => {
      setMode((m) => (m === "sign-in" ? "sign-up" : "sign-in"));
      setTimeout(() => setFormVisible(true), 400);
    }, 200);
  };

  const rootClass = [
    "auth-root",
    mode === "sign-in" ? "sign-in" : mode === "sign-up" ? "sign-up" : "",
  ].join(" ");

  return (
    <>
      <style>{authStyles}</style>

      <div className={rootClass}>
        <div className="auth-blob" />

        {/* FORM ROW */}
        <div className="auth-row">

          {/* Sign Up column */}
          <div className={`auth-col signup-col${mode === "sign-up" ? " active" : ""}`}>
            <RegisterForm toggle={toggle} formVisible={formVisible} mode={mode} />
          </div>

          {/* Sign In column */}
          <div className={`auth-col signin-col${mode === "sign-in" ? " active" : ""}`}>
            <LoginForm toggle={toggle} formVisible={formVisible} mode={mode} />
          </div>

        </div>

        {/* CONTENT ROW */}
        <div className="content-row">

          {/* Left — sign-in panel content */}
          <div className="content-col signin-content">
            <div className="content-text">
              <h2>Welcome back</h2>
              <p>Sign in to continue your Resonance experience</p>
            </div>
            <div className="graphic"><WelcomeGraphic /></div>
          </div>

          {/* Right — sign-up panel content */}
          <div className="content-col signup-content">
            <div className="graphic"><JoinGraphic /></div>
            <div className="content-text">
              <h2>Join with us</h2>
              <p>Stream, discover, and share music you love</p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}