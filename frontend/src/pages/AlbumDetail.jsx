import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getAlbumById } from "@/api/music.api"
import { useAuth } from "@/hooks/useAuth"
import MusicCard from "@/components/shared/MusicCard"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

function getGradient(str = "") {
  const pairs = [
    ["hsl(28,70%,75%)", "hsl(15,65%,60%)"],
    ["hsl(200,55%,72%)", "hsl(220,50%,60%)"],
    ["hsl(340,55%,75%)", "hsl(300,45%,62%)"],
    ["hsl(160,50%,70%)", "hsl(180,45%,58%)"],
    ["hsl(45,70%,75%)", "hsl(30,65%,60%)"],
  ]
  const idx = (str.charCodeAt(0) + (str.charCodeAt(1) || 0)) % pairs.length
  return `linear-gradient(145deg, ${pairs[idx][0]}, ${pairs[idx][1]})`
}

export default function AlbumDetail() {
  const { albumId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [album, setAlbum] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchAlbum() {
      try {
        const data = await getAlbumById(albumId)
        setAlbum(data.albums)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchAlbum()
  }, [albumId])

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
        <Skeleton className="w-24 h-8 rounded-full" style={{ backgroundColor: "var(--cream-dark)" }} />
        <div className="flex gap-6 items-end">
          <Skeleton className="w-36 h-36 rounded-2xl" style={{ backgroundColor: "var(--cream-dark)" }} />
          <div className="space-y-3 flex-1">
            <Skeleton className="h-8 w-1/2 rounded" style={{ backgroundColor: "var(--cream-dark)" }} />
            <Skeleton className="h-4 w-1/4 rounded" style={{ backgroundColor: "var(--cream-dark)" }} />
            <Skeleton className="h-3 w-1/5 rounded" style={{ backgroundColor: "var(--cream-dark)" }} />
          </div>
        </div>
        <div className="space-y-1 pt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3">
              <Skeleton className="w-7 h-4 rounded" style={{ backgroundColor: "var(--cream-dark)" }} />
              <Skeleton className="w-9 h-9 rounded-lg" style={{ backgroundColor: "var(--cream-dark)" }} />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-1/3 rounded" style={{ backgroundColor: "var(--cream-dark)" }} />
                <Skeleton className="h-3 w-1/5 rounded" style={{ backgroundColor: "var(--cream-dark)" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error || !album) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <p className="text-3xl mb-3">😕</p>
        <p className="text-sm font-medium mb-4" style={{ color: "var(--charcoal)" }}>
          {error || "Album not found"}
        </p>
        <Button
          variant="outline"
          onClick={() => navigate("/albums")}
          className="rounded-full"
          style={{ borderColor: "var(--border)", color: "var(--charcoal)" }}
        >
          ← Back to Albums
        </Button>
      </div>
    )
  }

  const tracks = album.musics || []

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">

      {/* Back button */}
      <button
        onClick={() => navigate("/albums")}
        className="anim-fade-up anim-delay-1 flex items-center gap-2 text-sm mb-8 hover:opacity-70 transition-opacity"
        style={{ color: "var(--charcoal-muted)" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
        </svg>
        All Albums
      </button>

      {/* Album hero */}
      <div className="anim-fade-up anim-delay-2 flex flex-col sm:flex-row gap-6 items-start sm:items-end mb-10">
        {/* Art */}
        <div
          className="w-36 h-36 rounded-2xl flex items-center justify-center text-5xl shrink-0 shadow-lg"
          style={{ background: getGradient(album.title) }}
        >
          📀
        </div>

        {/* Meta */}
        <div className="flex-1 min-w-0">
          <p
            className="text-xs font-medium uppercase tracking-widest mb-2"
            style={{ color: "var(--charcoal-muted)" }}
          >
            Album
          </p>
          <h1
            className="font-display text-4xl font-semibold leading-tight mb-2 truncate"
            style={{ color: "var(--charcoal)" }}
          >
            {album.title}
          </h1>
          <p className="text-sm" style={{ color: "var(--charcoal-muted)" }}>
            {album.artist?.username || "Unknown Artist"} · {tracks.length}{" "}
            {tracks.length === 1 ? "track" : "tracks"}
          </p>
        </div>

        {user && (album.artist?._id === user.id || album.artist === user.id) && (
          <Button
            onClick={() => navigate(`/artist/create-album?albumId=${album._id}`)}
            className="rounded-full px-6 text-sm shrink-0 hover:scale-[1.02] transition-transform cursor-pointer"
            style={{
              backgroundColor: "var(--charcoal)",
              color: "var(--cream)",
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            ✏️ Edit Album
          </Button>
        )}
      </div>

      {/* Track list */}
      <section className="anim-fade-up anim-delay-3">
        <h2
          className="font-display text-xl font-medium mb-4"
          style={{ color: "var(--charcoal)" }}
        >
          Tracks
        </h2>

        {tracks.length === 0 ? (
          <div
            className="rounded-2xl px-6 py-12 text-center"
            style={{ border: "1px solid var(--border)" }}
          >
            <p className="text-2xl mb-2">🎵</p>
            <p className="text-sm" style={{ color: "var(--charcoal-muted)" }}>
              No tracks in this album yet.
            </p>
          </div>
        ) : (
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: "1px solid var(--border)" }}
          >
            {tracks.map((track, i) => (
              <div
                key={track._id}
                style={{
                  borderBottom: i < tracks.length - 1 ? "1px solid var(--border)" : "none",
                }}
              >
                <MusicCard track={track} index={i} queue={tracks} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}