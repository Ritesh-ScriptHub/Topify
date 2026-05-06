const cookieParser = require("cookie-parser");
const cors = require("cors")
const express = require("express");
const authRoutes = require("./routes/auth.routes");
const musicRoutes = require("./routes/music.routes");
const rateLimit = require("express-rate-limit")

const app = express();

// CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:5173"]

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) return callback(null, true)
    callback(new Error(`CORS: origin ${origin} not allowed`))
  },
  credentials: true,
}))

// RATE LIMITING
// Tight limit on auth routes — 20 attempts per 15 min per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Too many attempts, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
})

// Generous limit on API routes — 200 requests per 15 min per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { message: "Too many requests, please slow down." },
  standardHeaders: true,
  legacyHeaders: false,
})

//middlewares
app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRoutes);

app.use("/api/music", musicRoutes);


module.exports = app;