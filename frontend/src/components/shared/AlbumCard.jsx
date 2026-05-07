import { Link, useNavigate  } from "react-router-dom"

function getGradient(str = "") {
  const pairs = [
    ["hsl(28,70%,75%)", "hsl(15,65%,60%)"],
    ["hsl(200,55%,72%)", "hsl(220,50%,60%)"],
    ["hsl(340,55%,75%)", "hsl(300,45%,62%)"],
    ["hsl(160,50%,70%)", "hsl(180,45%,58%)"],
    ["hsl(45,70%,75%)", "hsl(30,65%,60%)"],
  ]
  const idx = (str.charCodeAt(0) + str.charCodeAt(1 % str.length)) % pairs.length
  return `linear-gradient(145deg, ${pairs[idx][0]}, ${pairs[idx][1]})`
}

export default function AlbumCard({ album }) {
  const navigate = useNavigate()
  
  return (
    <Link to={`/albums/${album._id}`} className="group block">
      <div
        className="rounded-2xl overflow-hidden transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-xl"
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      >
        {/* Art block */}
        <div
          className="w-full aspect-square flex items-center justify-center text-5xl"
          style={{ background: getGradient(album.title) }}
        >
          📀
        </div>

        {/* Info */}
        <div className="p-4">
          <p
            className="font-display text-base font-medium truncate mb-0.5"
            style={{ color: "var(--charcoal)" }}
          >
            {album.title}
          </p>
          <p
            className="text-xs truncate cursor-pointer hover:underline underline-offset-4 hover:opacity-70 transition-opacity"
            style={{ color: "var(--charcoal-muted)" }}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (album.artist?.username) {
                navigate(`/artist/${album.artist.username}`)
              }
            }}
          >
            {album.artist?.username || "Unknown Artist"}
          </p>
        </div>
      </div>
    </Link>
  )
}