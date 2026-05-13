# Topify 🎵

A full-stack music streaming platform where artists upload and manage their music, and listeners discover and stream tracks and albums. Built as an intermediate-level MERN project with a clean editorial design and real audio playback.

**Live Demo:** [topify-orpin.vercel.app](https://topify-orpin.vercel.app)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Known Limitations](#known-limitations)

---

## Features

### Listeners
- Browse and stream all tracks from every artist on the platform
- Explore full album experiences
- Search for tracks, albums, and artists
- Persistent audio player with queue, seek, prev/next, and volume control
- Visit artist profile pages

### Artists
- Upload audio tracks (mp3, wav, flac, aac) via drag-and-drop
- Create albums from your own uploaded tracks
- View your personal studio dashboard with track and album counts

### General
- JWT-based authentication with secure `httpOnly` cookies
- Role-based access control (listener vs artist)
- Dark / light mode toggle with zero flash on reload
- Fully responsive — works on mobile, tablet, and desktop

---

## Tech Stack

### Backend
| | |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT + bcryptjs |
| File Storage | ImageKit |
| File Upload | Multer (memory storage) |
| Security | cors, express-rate-limit |

### Frontend
| | |
|---|---|
| Framework | React 18 (Vite) |
| Routing | React Router v6 |
| UI Library | shadcn/ui |
| Styling | Tailwind CSS v4 |
| State | Context API (AuthContext, PlayerContext) |
| HTTP | Native fetch API |
| Fonts | Fraunces (display) + Outfit (UI) |

---

## Project Structure

```
topify/
├── backend/
│   ├── db/
│   │   └── db.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── music.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── models/
│   │   ├── user.model.js
│   │   ├── music.model.js
│   │   └── album.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── music.routes.js
│   ├── services/
│   │   └── storage.service.js
│   ├── app.js
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   ├── base.js
    │   │   ├── auth.api.js
    │   │   └── music.api.js
    │   ├── components/
    │   │   ├── layout/
    │   │   │   ├── AppLayout.jsx
    │   │   │   ├── Navbar.jsx
    │   │   │   └── PlayerBar.jsx
    │   │   ├── shared/
    │   │   │   ├── MusicCard.jsx
    │   │   │   ├── AlbumCard.jsx
    │   │   │   ├── ArtistCard.jsx
    │   │   │   └── ProtectedRoute.jsx
    │   │   └── ui/               # shadcn auto-generated
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── PlayerContext.jsx
    │   ├── hooks/
    │   │   ├── useAuth.js
    │   │   ├── usePlayer.js
    │   │   └── useTheme.js
    │   ├── pages/
    │   │   ├── auth/
    │   │   │   ├── LoginForm.jsx
    │   │   │   ├── RegisterForm.jsx
    │   │   │   ├── LoginSignup.jsx
    │   │   │   └── AuthStyles.jsx
    │   │   ├── Landing.jsx
    │   │   ├── Home.jsx
    │   │   ├── Albums.jsx
    │   │   ├── AlbumDetail.jsx
    │   │   ├── Search.jsx
    │   │   ├── ArtistProfile.jsx
    │   │   ├── ArtistDashboard.jsx
    │   │   ├── UploadMusic.jsx
    │   │   └── CreateAlbum.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    └── index.html
```

---

## API Reference

All routes are prefixed with `/api`. Protected routes require a valid `token` cookie set at login.

### Auth

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register a new user or artist |
| POST | `/auth/login` | Public | Login and receive session cookie |
| POST | `/auth/logout` | Public | Clear session cookie |

### Music

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/music` | Listener + Artist | Paginated track list (`?page=1&limit=10`) |
| POST | `/music/upload` | Artist only | Upload a new track (multipart/form-data) |
| POST | `/music/album` | Artist only | Create a new album |
| GET | `/music/albums` | Listener + Artist | All albums |
| GET | `/music/albums/:albumId` | Listener + Artist | Single album with populated tracks |
| GET | `/music/artist/:username` | Listener + Artist | Artist public profile with tracks and albums |
| GET | `/music/search?q=query` | Listener + Artist | Search tracks, albums, and artists |

### Rate Limits

| Route group | Limit |
|---|---|
| `/api/auth/*` | 20 requests / 15 min per IP |
| `/api/music/*` | 200 requests / 15 min per IP |

---

## Deployment

### Backend → Render
### Frontend → Vercel

## Known Limitations

- **Render free tier cold starts** — The backend spins down after 15 minutes of inactivity. First request after sleep takes ~30 seconds. Upgrade to Render Starter ($7/mo) to eliminate this.
- **No audio waveform** — The player shows a static progress bar rather than a real waveform visualisation.
- **Follow feature is UI-only** — The Follow button on artist profiles toggles state locally but has no backend persistence yet.
- **No pagination on albums** — Albums page loads all albums in one request. Fine at current scale, needs pagination when the catalogue grows.
- **Storage is ImageKit** — Suitable for development and small scale. Migration path to AWS S3 or Cloudinary is isolated to `storage.service.js`.

---

## License

MIT © 2025 Topify
