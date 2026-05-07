import { useNavigate } from "react-router-dom"

function getGradient(str = "") {
  if (!str) return "linear-gradient(145deg, hsl(28,70%,75%), hsl(15,65%,60%))"
  const pairs = [
    ["hsl(28,70%,75%)", "hsl(15,65%,60%)"],
    ["hsl(200,55%,72%)", "hsl(220,50%,60%)"],
    ["hsl(340,55%,75%)", "hsl(300,45%,62%)"],
    ["hsl(160,50%,70%)", "hsl(180,45%,58%)"],
    ["hsl(45,70%,75%)", "hsl(30,65%,60%)"],
  ]
  const idx = str.charCodeAt(0) % pairs.length
  return `linear-gradient(145deg, ${pairs[idx][0]}, ${pairs[idx][1]})`
}

export default function ArtistCard({ artist }) {
  const navigate = useNavigate()

  return (
    <div
      className="flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all hover:scale-[1.01]"
      style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      onClick={() => navigate(`/artist/${artist.username}`)}
    >
      {/* Avatar */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
        style={{ background: getGradient(artist.username) }}
      >
        🎙️
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-medium truncate"
          style={{ color: "var(--charcoal)", fontFamily: "'Outfit', sans-serif" }}
        >
          {artist.username}
        </p>
        <p
          className="text-xs mt-0.5"
          style={{ color: "var(--charcoal-muted)" }}
        >
          Artist
        </p>
      </div>

      {/* Arrow */}
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="var(--charcoal-muted)"
        className="shrink-0"
      >
        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
      </svg>
    </div>
  )
}