export const AMBER = {
  50:  "#FAEEDA",
  100: "#FAC775",
  200: "#EF9F27",
  400: "#BA7517",
  600: "#854F0B",
  800: "#633806",
  900: "#412402",
};

export const authStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .auth-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    width: 100%;
    background: #0d0905;
    overflow: hidden;
    position: relative;
  }

  /* ── BACKGROUND BLOB ── */
  .auth-blob {
    position: absolute;
    top: 0; right: 0;
    height: 100vh;
    width: 300vw;
    background: linear-gradient(135deg, ${AMBER[200]} 0%, ${AMBER[400]} 50%, ${AMBER[600]} 100%);
    border-bottom-right-radius: max(50vw, 50vh);
    border-top-left-radius: max(50vw, 50vh);
    transform: translate(35%, 0);
    transition: transform 0.9s cubic-bezier(.77,0,.18,1), right 0.9s cubic-bezier(.77,0,.18,1);
    z-index: 6;
    box-shadow: 0 8px 48px rgba(0,0,0,0.45);
  }
  .auth-root.sign-in .auth-blob {
    transform: translate(0%, 0);
    right: 50%;
  }
  .auth-root.sign-up .auth-blob {
    transform: translate(100%, 0);
    right: 50%;
  }

  /* ── LAYOUT ── */
  .auth-row {
    display: flex;
    flex-wrap: wrap;
    height: 100vh;
  }
  .auth-col {
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  /* ── FORMS ── */
  .form-wrapper {
    width: 100%;
    max-width: 26rem;
    padding: 0 1.5rem;
  }
  .auth-form {
    background: #fff;
    border-radius: 1.75rem;
    padding: 2rem 1.75rem;
    box-shadow: 0 20px 60px rgba(0,0,0,0.25);
    transform: scale(0) translateY(20px);
    opacity: 0;
    transition: transform 0.5s cubic-bezier(.34,1.56,.64,1), opacity 0.4s ease;
    transition-delay: 0.9s;
  }
  .auth-form.visible {
    transform: scale(1) translateY(0);
    opacity: 1;
  }

  /* ── LOGO ── */
  .form-logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }
  .form-logo-mark {
    width: 32px; height: 32px;
    background: ${AMBER[200]};
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; font-weight: 800;
    color: ${AMBER[800]};
    font-family: 'Outfit', sans-serif;
  }
  .form-logo-text {
    font-family: 'Outfit', sans-serif;
    font-weight: 700;
    font-size: 1.1rem;
    color: #1a1005;
    letter-spacing: -0.5px;
  }

  /* ── TYPOGRAPHY ── */
  .form-heading {
    font-family: 'Outfit', sans-serif;
    font-size: 1.6rem;
    font-weight: 700;
    color: #1a1005;
    margin-bottom: 0.25rem;
  }
  .form-subheading {
    font-size: 0.82rem;
    color: #8a7860;
    margin-bottom: 1.5rem;
  }

  /* ── INPUTS ── */
  .input-group {
    position: relative;
    margin-bottom: 1rem;
  }
  .input-group svg {
    position: absolute;
    left: 0.9rem;
    top: 50%;
    transform: translateY(-50%);
    color: #b8a48a;
    width: 18px; height: 18px;
    pointer-events: none;
  }
  .input-group input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.75rem;
    background: #fdf8f1;
    border: 1.5px solid #ede0cc;
    border-radius: 0.65rem;
    font-size: 0.9rem;
    font-family: 'DM Sans', sans-serif;
    color: #1a1005;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .input-group input::placeholder { color: #b8a48a; }
  .input-group input:focus {
    border-color: ${AMBER[200]};
    box-shadow: 0 0 0 3px rgba(239,159,39,0.15);
  }

  /* ── BUTTON ── */
  .auth-btn {
    width: 100%;
    padding: 0.8rem;
    border: none;
    border-radius: 0.65rem;
    background: linear-gradient(135deg, ${AMBER[200]}, ${AMBER[400]});
    color: #fff;
    font-family: 'Outfit', sans-serif;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
    box-shadow: 0 4px 16px rgba(186,117,23,0.35);
    letter-spacing: 0.3px;
    margin-top: 0.25rem;
  }
  .auth-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(186,117,23,0.45);
  }
  .auth-btn:active { transform: translateY(0); }
  .auth-btn:disabled {
    opacity: 0.65;
    cursor: not-allowed;
    transform: none;
  }

  /* ── FOOTER ── */
  .form-footer {
    text-align: center;
    margin-top: 1.25rem;
    font-size: 0.8rem;
    color: #8a7860;
  }
  .form-footer b {
    color: ${AMBER[400]};
    cursor: pointer;
    font-weight: 600;
    transition: color 0.2s;
  }
  .form-footer b:hover { color: ${AMBER[600]}; }
  .form-footer .forgot {
    color: ${AMBER[400]};
    cursor: pointer;
    font-weight: 500;
    font-size: 0.8rem;
    display: block;
    margin-top: 0.75rem;
    transition: color 0.2s;
  }
  .form-footer .forgot:hover { color: ${AMBER[600]}; }

  /* ── ERROR BANNER ── */
  .auth-error {
    background: #FEF2F2;
    color: #DC2626;
    border: 1px solid #FECACA;
    border-radius: 0.65rem;
    padding: 0.65rem 1rem;
    font-size: 0.82rem;
    margin-bottom: 0.75rem;
  }

  /* ── ROLE SELECTOR (Register only) ── */
  .role-selector {
    display: flex;
    gap: 0.6rem;
    margin-bottom: 1rem;
  }
  .role-btn {
    flex: 1;
    padding: 0.55rem 0;
    border-radius: 0.65rem;
    font-size: 0.82rem;
    font-weight: 600;
    font-family: 'Outfit', sans-serif;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1.5px solid #ede0cc;
    background: #fdf8f1;
    color: #8a7860;
  }
  .role-btn.active {
    background: #1a1005;
    color: #fff;
    border-color: #1a1005;
  }
  .role-btn:hover:not(.active) {
    border-color: ${AMBER[200]};
    color: ${AMBER[400]};
  }

  /* ── CONTENT PANEL (animated overlay) ── */
  .content-row {
    position: absolute;
    top: 0; left: 0;
    width: 100%;
    height: 100vh;
    display: flex;
    pointer-events: none;
    z-index: 7;
  }
  .content-col {
    width: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .content-text {
    text-align: center;
    padding: 1rem 2rem;
    color: #fff;
  }
  .content-text h2 {
    font-family: 'Outfit', sans-serif;
    font-size: clamp(2rem, 4vw, 3.5rem);
    font-weight: 800;
    letter-spacing: -1px;
    color: #fff;
    text-shadow: 0 2px 20px rgba(0,0,0,0.2);
    transition: transform 0.8s cubic-bezier(.77,0,.18,1);
  }
  .content-text p {
    font-size: 0.95rem;
    color: rgba(255,255,255,0.85);
    margin-top: 0.5rem;
    font-weight: 400;
    transition: transform 0.8s cubic-bezier(.77,0,.18,1);
    transition-delay: 0.1s;
  }

  /* slide-out by default */
  .content-col.signin-content .content-text h2,
  .content-col.signin-content .content-text p,
  .content-col.signin-content .graphic { transform: translateX(-300%); }
  .content-col.signup-content .content-text h2,
  .content-col.signup-content .content-text p,
  .content-col.signup-content .graphic { transform: translateX(300%); }

  /* slide-in when active */
  .auth-root.sign-in .content-col.signin-content .content-text h2,
  .auth-root.sign-in .content-col.signin-content .content-text p,
  .auth-root.sign-in .content-col.signin-content .graphic { transform: translateX(0); }
  .auth-root.sign-up .content-col.signup-content .content-text h2,
  .auth-root.sign-up .content-col.signup-content .content-text p,
  .auth-root.sign-up .content-col.signup-content .graphic { transform: translateX(0); }

  .graphic {
    margin-top: 2rem;
    transition: transform 0.8s cubic-bezier(.77,0,.18,1);
    transition-delay: 0.2s;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 600px) {
    .auth-blob,
    .auth-root.sign-in .auth-blob,
    .auth-root.sign-up .auth-blob {
      height: 100vh;
      border-radius: 0;
      z-index: 0;
      transform: none;
      right: 0;
      width: 100%;
    }
    .auth-col {
      width: 100%;
      position: absolute;
      background: #fff;
      border-top-left-radius: 2rem;
      border-top-right-radius: 2rem;
      transform: translateY(100%);
      transition: transform 0.7s cubic-bezier(.77,0,.18,1);
      padding: 2rem 1.25rem;
      bottom: 0;
      z-index: 8;
    }
    .auth-col.active { transform: translateY(0); }
    .form-wrapper { padding: 0; }
    .auth-form {
      box-shadow: none;
      border-radius: 0;
      padding: 0;
      background: transparent;
    }
    .auth-form.visible { transform: scale(1) translateY(0); opacity: 1; }
    .content-row {
      z-index: 1;
      height: 45vh;
    }
    .content-col {
      width: 100%;
      position: absolute;
      bottom: unset;
      top: 0;
      height: 45vh;
      transform: none !important;
      background: transparent;
    }
    .content-col.signup-content { display: none; }
    .auth-root.sign-up .content-col.signup-content { display: flex; }
    .auth-root.sign-up .content-col.signin-content { display: none; }
    .content-col.signin-content .content-text h2,
    .content-col.signup-content .content-text h2,
    .content-col.signin-content .content-text p,
    .content-col.signup-content .content-text p,
    .content-col.signin-content .graphic,
    .content-col.signup-content .graphic { transform: none !important; }
    .content-text h2 { font-size: 2rem; }
    .content-text p { display: none; }
    .graphic svg { width: 80px; height: 80px; }
    .auth-row { align-items: flex-end; height: 100vh; }
    .auth-col.signup-col, .auth-col.signin-col { display: flex; }
  }
`;