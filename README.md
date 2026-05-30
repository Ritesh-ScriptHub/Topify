# <img src="https://lh3.googleusercontent.com/d/1JKx24SHoTGXeSdZsjpWbeoNk8Y6yk4mb" height="60" alt="Topify Logo" valign="middle"> Topify 

A full-stack music streaming platform where artists can upload tracks, create albums, and manage their music, while listeners can discover, search, and stream music through a responsive web player.

**Live Demo:** [topify-orpin.vercel.app](https://topify-orpin.vercel.app)  
**Repository:** [Ritesh-ScriptHub/Topify](https://github.com/Ritesh-ScriptHub/Topify)

## Features

### For listeners
- Browse paginated tracks from every artist
- Explore albums and album detail pages
- Search tracks, albums, and artists
- Stream music with a persistent player, queue controls, seeking, and volume
- Visit public artist profile pages

### For artists
- Register as an artist and verify the account by email
- Upload audio files with ImageKit-backed storage
- Create albums from owned uploaded tracks
- Access an artist dashboard with personal track and album stats

### Platform
- JWT authentication with secure `httpOnly` cookies
- Email verification and resend-verification flow powered by Resend
- Role-based route protection for listeners and artists
- Responsive React UI with dark/light theme support
- Express rate limiting and CORS configuration for deployment

## Tech Stack

### Frontend
| Area | Technology |
|---|---|
| Framework | React 19 + Vite |
| Routing | React Router 7 |
| Styling | Tailwind CSS 4 |
| UI | shadcn/ui, Radix UI, lucide-react |
| State | React Context API |
| API Client | Native `fetch` with credentials |

### Backend
| Area | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express 5 |
| Database | MongoDB + Mongoose |
| Authentication | JWT + bcryptjs |
| Email | Resend |
| File Upload | Multer memory storage |
| File Storage | ImageKit |
| Security | CORS, cookie-parser, express-rate-limit |

## Project Structure

```text
Topify/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   └── music.controller.js
│   │   ├── db/
│   │   │   └── db.js
│   │   ├── middleware/
│   │   │   └── auth.middleware.js
│   │   ├── models/
│   │   │   ├── album.model.js
│   │   │   ├── music.model.js
│   │   │   └── user.model.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   └── music.routes.js
│   │   ├── services/
│   │   │   ├── email.service.js
│   │   │   └── storage.service.js
│   │   └── app.js
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── context/
    │   ├── hooks/
    │   ├── lib/
    │   ├── pages/
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

## Getting Started

### Prerequisites
- Node.js 18 or newer
- MongoDB database
- ImageKit account
- Resend account and verified sender/domain

### Backend setup

```bash
cd backend
npm install
npm run dev
```

Create `backend/.env`:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173
FRONTEND_URL=http://localhost:5173
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
RESEND_API_KEY=your_resend_api_key
```

### Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

The frontend runs on `http://localhost:5173` by default and expects the backend API at `http://localhost:3000/api`.

## API Reference

All routes are prefixed with `/api`. Protected routes require the `token` cookie created during login.

### Auth

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Register a listener or artist and send a verification email |
| `POST` | `/auth/login` | Public | Login after email verification and set the session cookie |
| `POST` | `/auth/logout` | Public | Clear the session cookie |
| `POST` | `/auth/verify-email` | Public | Verify an account with an email token |
| `POST` | `/auth/resend-verification` | Public | Send a new verification email for an unverified account |

### Music

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/music?page=1&limit=10` | Authenticated | Fetch paginated tracks |
| `POST` | `/music/upload` | Artist | Upload a track with multipart field `music` |
| `POST` | `/music/album` | Artist | Create an album from the artist's own tracks |
| `GET` | `/music/albums` | Authenticated | Fetch all albums |
| `GET` | `/music/albums/:albumId` | Authenticated | Fetch one album with populated tracks |
| `GET` | `/music/artist/:username` | Authenticated | Fetch artist profile, tracks, and albums |
| `GET` | `/music/search?q=query` | Authenticated | Search tracks, albums, and artists |

## Frontend Routes

| Route | Access | Page |
|---|---|---|
| `/` | Public | Landing page |
| `/login` | Public | Login and registration |
| `/verify-email` | Public | Email verification result |
| `/home` | Authenticated | Music home feed |
| `/albums` | Authenticated | Album listing |
| `/albums/:albumId` | Authenticated | Album detail |
| `/artist/:username` | Authenticated | Public artist profile |
| `/search` | Authenticated | Search page |
| `/artist` | Artist | Artist dashboard |
| `/artist/upload` | Artist | Upload music |
| `/artist/create-album` | Artist | Create album |

## Deployment

### Backend on Render
- Set the backend root directory to `backend`
- Use `npm install` as the build command
- Use `node server.js` as the start command
- Add production environment variables, including `NODE_ENV=production`
- Set `ALLOWED_ORIGINS` and `FRONTEND_URL` to the deployed Vercel URL

### Frontend on Vercel
- Set the frontend root directory to `frontend`
- Add `VITE_API_URL` with the deployed backend API URL ending in `/api`
- Keep `vercel.json` rewrites enabled so React Router routes load correctly

## Rate Limits

| Route group | Limit |
|---|---|
| `/api/auth/*` | 20 requests per 15 minutes per IP |
| `/api/music/*` | 200 requests per 15 minutes per IP |

## Known Limitations

- The backend may have cold starts on Render's free tier.
- Albums are currently fetched without pagination.
- The player uses a standard progress bar instead of an audio waveform.
- Storage is configured for ImageKit and can be swapped through `storage.service.js`.

## License
MIT © 2026 Topify
