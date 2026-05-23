import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import "./Landing.css";

const STATS = [
  { value: "120K+", label: "Active Listeners" },
  { value: "37K+", label: "Tracks Published" },
  { value: "10K+", label: "Independent Artists" },
  { value: "320k", label: "Bitrate Quality" },
];

const TICKER_ITEMS = [
  "\u{1F3B5} Artist-first releases",
  "\u26A1 Persistent playback",
  "\u{1F50D} Search that feels instant",
  "\u{1F3A7} Designed for listeners and creators",
  "\u{1F399}\uFE0F No algorithms hiding you",
  "\u{1F4BF} Full album experiences",
  "\u{1F680} Upload in seconds",
  "\u2728 Role-aware product flow",
];

const PILLARS = [
  {
    icon: "\u25B6",
    heading: "Listener Experience",
    sub: "Streaming that stays out of the way",
    desc: "Move from discovery to playback in seconds with fast search, clean queueing, and a player that keeps your session alive.",
  },
  {
    icon: "\u{1F399}",
    heading: "Creator Workflow",
    sub: "A real home for artist uploads",
    desc: "Publish tracks, organize albums, and present your catalog with the polish your music deserves instead of blending into generic feeds.",
  },
  {
    icon: "\u2726",
    heading: "Brand Presence",
    sub: "Profiles built for identity",
    desc: "Listeners can follow the sound. Artists can shape the story with profile surfaces that feel intentional, not like an afterthought.",
  },
  {
    icon: "\u2B21",
    heading: "Platform Design",
    sub: "Role-aware product flow",
    desc: "Topify adapts to listener and artist journeys without making either side feel secondary, preserving clarity from signup to daily use.",
  },
];

const TESTIMONIALS = [
  { user: "Aryan M.", handle: "@aryanbeats", stars: 5, text: "Topify gave my music a home. Within weeks I had real listeners-no bots, no fake plays. Just people who genuinely care." },
  { user: "Sofia K.", handle: "@sofiamelody", stars: 5, text: "The player never skips. The search is instant. I've tried every streaming app and Topify is the one I keep coming back to." },
  { user: "Marcus D.", handle: "@mdproducer", stars: 5, text: "Uploading my album took under 5 minutes. The dashboard is clean, the analytics are honest. This is what indie artists needed." },
  { user: "Priya R.", handle: "@priyasounds", stars: 5, text: "I discovered three new favorite artists in my first hour. The editorial feel makes browsing feel like flipping through a music magazine." },
  { user: "James T.", handle: "@jtlistens", stars: 5, text: "No paywalls on discovery. No algorithm burying underground artists. Topify just... works. Feels like music first, product second." },
  { user: "Elena V.", handle: "@elenavoice", stars: 5, text: "As an artist, this platform respects my craft. My profile looks professional, my fans can find my full discography easily." },
];

const WAVEFORM = [3, 6, 9, 7, 11, 8, 14, 10, 7, 13, 9, 5, 12, 8, 15, 11, 6, 10, 8, 14, 7, 9, 12, 5, 8, 11, 6, 10, 13, 7];
const NAV_ITEMS = ["Home", "Features", "Explore", "Contact Us"];
const HERO_PILLS = ["Free forever", "No credit card needed", "Join in 30 seconds"];
const FLOATING_NOTES = [
  { symbol: "\u266A", top: "10%", left: "5%", fontSize: 14, duration: 3, delay: "0s" },
  { symbol: "\u266B", top: "75%", left: "85%", fontSize: 18, duration: 4, delay: "0.7s" },
  { symbol: "\u2669", top: "20%", left: "80%", fontSize: 12, duration: 5, delay: "1.4s" },
  { symbol: "\u{1D11E}", top: "60%", left: "2%", fontSize: 20, duration: 6, delay: "2.1s" },
];
const CTA_PARTICLES = [
  { size: 3, opacity: 0.3, top: "15%", left: "10%", duration: 3, delay: "0s" },
  { size: 4, opacity: 0.5, top: "30%", left: "80%", duration: 4, delay: "0.4s" },
  { size: 2, opacity: 0.2, top: "70%", left: "15%", duration: 5, delay: "0.8s" },
  { size: 5, opacity: 0.4, top: "20%", left: "70%", duration: 6, delay: "1.2s" },
  { size: 3, opacity: 0.3, top: "80%", left: "30%", duration: 3, delay: "1.6s" },
  { size: 4, opacity: 0.6, top: "50%", left: "90%", duration: 4, delay: "2s" },
  { size: 2, opacity: 0.2, top: "35%", left: "55%", duration: 5, delay: "2.4s" },
  { size: 3, opacity: 0.4, top: "65%", left: "40%", duration: 6, delay: "2.8s" },
  { size: 5, opacity: 0.3, top: "10%", left: "85%", duration: 3, delay: "3.2s" },
  { size: 2, opacity: 0.5, top: "85%", left: "20%", duration: 4, delay: "3.6s" },
  { size: 4, opacity: 0.2, top: "45%", left: "65%", duration: 5, delay: "4s" },
  { size: 3, opacity: 0.4, top: "25%", left: "45%", duration: 6, delay: "4.4s" },
];
const FOOTER_COLUMNS = [
  { title: "Explore", links: ["Features", "Artists", "Albums", "Search"] },
  { title: "Company", links: ["About", "Careers", "Press", "Contact"] },
  { title: "Resources", links: ["Help", "Community", "Privacy", "Terms"] },
];
const SOCIALS = [
  { icon: "X", label: "Twitter" },
  { icon: "Ig", label: "Instagram" },
  { icon: "Gh", label: "GitHub" },
  { icon: "f", label: "Facebook" },
  { icon: "M", label: "Mail" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, isArtist } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`landing-nav ${scrolled ? "landing-nav--scrolled" : ""}`}>
      <div className="landing-shell landing-nav__inner">
        <div className="landing-brand">
          <div className="landing-brand__mark">
            <img
              className="landing-brand__logo"
              src="https://lh3.googleusercontent.com/d/1JKx24SHoTGXeSdZsjpWbeoNk8Y6yk4mb"
              alt="logo"
            />
          </div>
          <span className="landing-brand__name">Topify</span>
        </div>

        <div className="landing-nav__links desktop-nav">
          {NAV_ITEMS.map((item) => (
            <a key={item} href="#" className="landing-link">
              {item}
            </a>
          ))}
        </div>

        <div className="landing-nav__actions desktop-nav">
          {isAuthenticated ? (
            <Link to={isArtist ? "/artist" : "/home"} className="landing-button-link">
              <button className="landing-button landing-button--primary">Go to App -&gt;</button>
            </Link>
          ) : (
            <>
              <Link to="/login" className="landing-button-link">
                <button className="landing-button landing-button--ghost">Sign In</button>
              </Link>
              <Link to="/register" className="landing-button-link">
                <button className="landing-button landing-button--primary">Get Started</button>
              </Link>
            </>
          )}
        </div>

        <button onClick={() => setMenuOpen((open) => !open)} className="mobile-menu-btn landing-nav__menu-btn">
          {menuOpen ? "\u2715" : "\u2630"}
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-menu landing-nav__mobile-menu">
          {NAV_ITEMS.map((item) => (
            <a key={item} href="#" className="landing-nav__mobile-link">
              {item}
            </a>
          ))}
          <div className="landing-nav__mobile-actions">
            <Link to="/login" className="landing-button-link landing-nav__mobile-action">
              <button className="landing-button landing-button--ghost landing-button--full">Sign In</button>
            </Link>
            <Link to="/register" className="landing-button-link landing-nav__mobile-action">
              <button className="landing-button landing-button--primary landing-button--full">Get Started</button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

function AnimWaveform({ playing }) {
  return (
    <div className="player-waveform">
      {WAVEFORM.map((height, index) => (
        <div
          key={index}
          className={`player-waveform__bar ${index < 18 ? "player-waveform__bar--active" : ""}`}
          style={{
            height: `${height * 2.2}px`,
            animation: playing ? `wave ${0.6 + (index % 5) * 0.15}s ease-in-out infinite alternate` : "none",
            animationDelay: `${index * 0.04}s`,
          }}
        />
      ))}
    </div>
  );
}

function MusicPlayerCard() {
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(42);

  useEffect(() => {
    if (!playing) return undefined;
    const timer = setInterval(() => setProgress((value) => (value >= 100 ? 0 : value + 0.3)), 300);
    return () => clearInterval(timer);
  }, [playing]);

  return (
    <div className="player-wrap">
      {[560, 440, 340].map((size, index) => (
        <div
          key={size}
          className="player-orbit"
          style={{
            width: size,
            height: size,
            border: `1px solid rgba(255,159,28,${[0.1, 0.14, 0.18][index]})`,
            boxShadow: `0 0 ${[8, 12, 16][index]}px rgba(255,159,28,${[0.04, 0.06, 0.08][index]})`,
            animation: index % 2 === 0 ? `ringPulse ${4 + index}s ease-in-out infinite alternate` : "none",
          }}
        >
          <div
            className="player-orbit__dot"
            style={{
              width: [6, 5, 4][index],
              height: [6, 5, 4][index],
              boxShadow: `0 0 ${[10, 8, 6][index]}px #FF9F1C`,
              left: -[6, 5, 4][index] / 2,
              animation: `orbitDot ${[12, 18, 10][index]}s linear infinite${index === 1 ? " reverse" : ""}`,
              transformOrigin: `${size / 2 + [6, 5, 4][index] / 2}px 50%`,
            }}
          />
        </div>
      ))}

      {FLOATING_NOTES.map((note) => (
        <div
          key={`${note.symbol}-${note.top}-${note.left}`}
          className="player-note"
          style={{
            top: note.top,
            left: note.left,
            fontSize: note.fontSize,
            animation: `floatNote ${note.duration}s ease-in-out infinite alternate`,
            animationDelay: note.delay,
          }}
        >
          {note.symbol}
        </div>
      ))}

      <div className="player-glow" />

      <div className="player-card">
        <div className="player-card__art">
          <div className="player-card__art-overlay" />
          <svg viewBox="0 0 300 200" className="player-card__svg">
            <defs>
              <radialGradient id="glow1" cx="50%" cy="60%">
                <stop offset="0%" stopColor="rgba(255,159,28,0.3)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
              <radialGradient id="rimLight" cx="80%" cy="30%">
                <stop offset="0%" stopColor="rgba(255,130,20,0.6)" />
                <stop offset="60%" stopColor="transparent" />
              </radialGradient>
            </defs>
            <image
              href="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUQM7FpCjdUDwvl546WU_pa2qPNPOPHmF50g&s"
              x="0"
              y="0"
              width="300"
              height="200"
              preserveAspectRatio="xMidYMid slice"
            />
          </svg>

          <div className="player-card__badge">
            <p className="player-card__badge-text">NOW PLAYING</p>
          </div>
        </div>

        <div className="player-card__body">
          <div className="player-card__meta">
            <p className="player-card__title">Shape of You</p>
            <p className="player-card__artist">Ed Sheeran</p>
          </div>

          <AnimWaveform playing={playing} />

          <div className="player-card__progress">
            <div className="player-card__progress-track">
              <div className="player-card__progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="player-card__time">
            <span>1:42</span>
            <span>3:58</span>
          </div>

          <div className="player-card__controls">
            <button className="player-card__control player-card__control--muted" type="button">
              &#9198;
            </button>
            <button
              type="button"
              onClick={() => setPlaying((value) => !value)}
              className="player-card__control player-card__control--play"
            >
              {playing ? "\u23F8" : "\u25B6"}
            </button>
            <button className="player-card__control player-card__control--muted" type="button">
              &#9197;
            </button>
          </div>
        </div>
      </div>

      <div className="player-chip player-chip--likes">
        <span className="player-chip__text">&#9829; 4.2K</span>
      </div>

      <div className="player-chip player-chip--trending">
        <span className="player-chip__text player-chip__text--trending">&#128293; Trending</span>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="landing-hero">
      <div className="landing-hero__blob landing-hero__blob--left" />
      <div className="landing-hero__blob landing-hero__blob--right" />

      <div className="landing-shell landing-hero__grid hero-grid">
        <div className="landing-hero__content">

          <h1 className="landing-hero__title">
            Where artists <span className="landing-highlight">share</span>,
            <br />
            listeners <span className="landing-highlight">discover.</span>
          </h1>

          <p className="landing-hero__copy">
            Topify connects independent artists with listeners who actually care.
            Upload your craft. Find your sound. No algorithms hiding you.
          </p>

          <div className="landing-hero__actions">
            <Link to="/register" className="landing-button-link">
              <button className="landing-button landing-button--primary landing-button--hero">Start Listening Free</button>
            </Link>
            <Link to="/register" state={{ role: "artist" }} className="landing-button-link">
              <button className="landing-button landing-button--outline landing-button--hero">I'm an Artist -&gt;</button>
            </Link>
          </div>

          <div className="landing-hero__pills">
            {HERO_PILLS.map((item) => (
              <div key={item} className="landing-hero__pill">
                <span className="landing-hero__pill-check">&#10003;</span>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="landing-hero__player hero-player">
          <MusicPlayerCard />
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="landing-stats">
      <div className="landing-stats__glow" />

      <div className="landing-shell">
        <div className="landing-stats__grid stats-grid">
          {STATS.map((stat) => (
            <div key={stat.label} className="landing-stats__card">
              <p className="landing-stats__value stat-value">{stat.value}</p>
              <p className="landing-stats__label">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="landing-stats__ticker-mask">
        <div className="landing-stats__ticker">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, index) => (
            <div key={`${item}-${index}`} className="landing-stats__ticker-item">
              {item}
              <span className="landing-stats__ticker-separator">&#9674;</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PillarsSection() {
  return (
    <section className="landing-pillars">
      <div className="landing-pillars__glow" />

      <div className="landing-shell">
        <div className="landing-pillars__header">
          <div className="landing-section-label">Product Pillars</div>
          <h2 className="landing-section-title landing-section-title--wide">
            A premium music platform designed around <span className="landing-highlight">clarity</span>, momentum, and artist identity.
          </h2>
        </div>

        <div className="landing-pillars__grid pillars-grid">
          {PILLARS.map((pillar) => (
            <div key={pillar.heading} className="landing-pillars__card">
              <div className="landing-pillars__icon">{pillar.icon}</div>
              <p className="landing-pillars__eyebrow">{pillar.heading}</p>
              <h3 className="landing-pillars__title">{pillar.sub}</h3>
              <p className="landing-pillars__copy">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="landing-testimonials">
      <div className="landing-shell landing-testimonials__header">
        <div className="landing-testimonials__header-inner">
          <div className="landing-section-label">Testimonials</div>
          <h2 className="landing-section-title">What our listeners say</h2>
        </div>
      </div>

      <div className="landing-testimonials__track-mask landing-testimonials__track-mask--spaced">
        <div className="landing-testimonials__track">
          {[...TESTIMONIALS, ...TESTIMONIALS].map((testimonial, index) => (
            <TestimonialCard key={`${testimonial.handle}-${index}`} testimonial={testimonial} />
          ))}
        </div>
      </div>

      <div className="landing-testimonials__track-mask">
        <div className="landing-testimonials__track landing-testimonials__track--reverse">
          {[...TESTIMONIALS.slice().reverse(), ...TESTIMONIALS.slice().reverse()].map((testimonial, index) => (
            <TestimonialCard key={`${testimonial.user}-${index}`} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }) {
  return (
    <div className="landing-testimonials__card">
      <div className="landing-testimonials__stars">
        {[...Array(testimonial.stars)].map((_, index) => (
          <span key={index} className="landing-testimonials__star">
            &#9733;
          </span>
        ))}
      </div>

      <p className="landing-testimonials__quote">"{testimonial.text}"</p>

      <div className="landing-testimonials__person">
        <div
          className="landing-testimonials__avatar"
          style={{
            background: `linear-gradient(135deg, hsl(${(testimonial.user.charCodeAt(0) * 5) % 360}, 60%, 40%), hsl(${(testimonial.user.charCodeAt(1) * 7) % 360}, 70%, 50%))`,
          }}
        >
          {testimonial.user[0]}
        </div>
        <div>
          <p className="landing-testimonials__name">{testimonial.user}</p>
          <p className="landing-testimonials__handle">{testimonial.handle}</p>
        </div>
      </div>
    </div>
  );
}

function CTASection() {
  return (
    <section className="landing-cta">
      {CTA_PARTICLES.map((particle, index) => (
        <div
          key={index}
          className="landing-cta__particle"
          style={{
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
            top: particle.top,
            left: particle.left,
            animation: `floatNote ${particle.duration}s ease-in-out infinite alternate`,
            animationDelay: particle.delay,
          }}
        />
      ))}

      <div className="landing-cta__glow" />
      <div className="landing-cta__ring landing-cta__ring--small" />
      <div className="landing-cta__ring landing-cta__ring--large" />

      <div className="landing-cta__content">
        <div className="landing-cta__icon">&#127911;</div>
        <div className="landing-section-label landing-section-label--center">Start your journey</div>

        <h2 className="landing-cta__title">
          Start your music <span className="landing-highlight">journey today</span>
        </h2>

        <p className="landing-cta__copy">
          Join millions of listeners and artists on Topify. Your next favorite song is waiting.
        </p>

        <div className="landing-cta__actions">
          <Link to="/register" className="landing-button-link">
            <button className="landing-button landing-button--primary landing-button--cta">Start Listening Now</button>
          </Link>
          <Link to="/register" state={{ role: "artist" }} className="landing-button-link">
            <button className="landing-button landing-button--outline landing-button--cta">Create Artist Account</button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="landing-footer">
      <div className="landing-footer__divider" />

      <div className="landing-shell landing-footer__grid footer-grid">
        <div>
          <div className="landing-footer__brand">
            <div className="landing-footer__brand-mark">&#9834;</div>
            <span className="landing-footer__brand-name">Topify</span>
          </div>

          <p className="landing-footer__copy">
            Independent music, direct connections. Built for artists who create and listeners who care.
          </p>

          <div className="landing-footer__socials">
            {SOCIALS.map((social) => (
              <button key={social.label} type="button" title={social.label} className="landing-footer__social-btn">
                {social.icon}
              </button>
            ))}
          </div>
        </div>

        {FOOTER_COLUMNS.map((column) => (
          <div key={column.title}>
            <p className="landing-footer__column-title">{column.title}</p>
            {column.links.map((link) => (
              <a key={link} href="#" className="landing-footer__link">
                {link}
              </a>
            ))}
          </div>
        ))}
      </div>

      <div className="landing-shell landing-footer__bottom">
        <p className="landing-footer__bottom-text">&copy; 2026 TOPIFY. All rights reserved.</p>
        <p className="landing-footer__bottom-text">Made for music lovers &#9834;</p>
      </div>
    </footer>
  );
}

export default function TopifyLanding() {
  useEffect(() => {
    document.body.classList.add("landing-body");
    document.documentElement.classList.add("landing-html");

    return () => {
      document.body.classList.remove("landing-body");
      document.documentElement.classList.remove("landing-html");
    };
  }, []);

  return (
    <div className="landing-page">
      <div className="landing-page__noise" />

      <div className="landing-page__content">
        <Navbar />
        <HeroSection />
        <StatsSection />
        <PillarsSection />
        <TestimonialsSection />
        <CTASection />
        <Footer />
      </div>
    </div>
  );
}
