import { useEffect, useState } from "react"
import { getAllMusics } from "@/api/music.api"
import { useAuth } from "@/hooks/useAuth"
import MusicCard from "@/components/shared/MusicCard"
import { Skeleton } from "@/components/ui/skeleton"

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 17) return "Good afternoon"
  return "Good evening"
}

function TrackSkeleton() {
  return (
    <div className="flex items-center gap-4 px-4 py-3">
      <Skeleton className="w-7 h-4 rounded" style={{ backgroundColor: "var(--cream-dark)" }} />
      <Skeleton className="w-9 h-9 rounded-lg" style={{ backgroundColor: "var(--cream-dark)" }} />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-1/3 rounded" style={{ backgroundColor: "var(--cream-dark)" }} />
        <Skeleton className="h-3 w-1/5 rounded" style={{ backgroundColor: "var(--cream-dark)" }} />
      </div>
    </div>
  )
}

export default function Home() {
  const { user } = useAuth()
  const [musics, setMusics] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchMusics() {
      try {
        const data = await getAllMusics()
        setMusics(data.musics || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchMusics()
  }, [])

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="mb-10 anim-fade-up anim-delay-1">
        <p className="text-sm mb-1" style={{ color: "var(--charcoal-muted)" }}>
          {getGreeting()},
        </p>
        <h1
          className="font-display text-4xl font-semibold"
          style={{ color: "var(--charcoal)" }}
        >
          {user?.username} 👋
        </h1>
      </div>

      {/* Track list */}
      <section className="anim-fade-up anim-delay-2">
        <div className="flex items-center justify-between mb-5">
          <h2
            className="font-display text-xl font-medium"
            style={{ color: "var(--charcoal)" }}
          >
            All Tracks
          </h2>
          {!loading && !error && (
            <span
              className="text-xs px-3 py-1 rounded-full"
              style={{
                backgroundColor: "var(--cream-dark)",
                color: "var(--charcoal-muted)",
              }}
            >
              {musics.length} {musics.length === 1 ? "track" : "tracks"}
            </span>
          )}
        </div>

        {/* Divider */}
        <div
          className="grid gap-0 rounded-2xl overflow-hidden"
          style={{ border: "1px solid var(--border)" }}
        >
          {loading && (
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                style={{ borderBottom: i < 4 ? "1px solid var(--border)" : "none" }}
              >
                <TrackSkeleton />
              </div>
            ))
          )}

          {error && (
            <div className="px-6 py-12 text-center">
              <p className="text-2xl mb-2">😕</p>
              <p
                className="text-sm font-medium mb-1"
                style={{ color: "var(--charcoal)" }}
              >
                Couldn't load tracks
              </p>
              <p className="text-xs" style={{ color: "var(--charcoal-muted)" }}>
                {error}
              </p>
            </div>
          )}

          {!loading && !error && musics.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-2xl mb-2">🎵</p>
              <p
                className="text-sm font-medium mb-1"
                style={{ color: "var(--charcoal)" }}
              >
                No tracks yet
              </p>
              <p className="text-xs" style={{ color: "var(--charcoal-muted)" }}>
                Artists haven't uploaded anything yet. Check back soon!
              </p>
            </div>
          )}

          {!loading && !error && musics.map((track, i) => (
            <div
              key={track._id}
              style={{
                borderBottom: i < musics.length - 1 ? "1px solid var(--border)" : "none",
              }}
            >
              <MusicCard track={track} index={i} queue={musics} />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}