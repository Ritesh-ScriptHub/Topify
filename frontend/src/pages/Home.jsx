import { useEffect, useState, useCallback } from "react"
import { getAllMusics } from "@/api/music.api"
import { useAuth } from "@/hooks/useAuth"
import MusicCard from "@/components/shared/MusicCard"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

const LIMIT = 10

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
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)

  // Initial load
  useEffect(() => {
    async function fetchInitial() {
      try {
        const data = await getAllMusics(1, LIMIT)
        setMusics(data.musics || [])
        setHasMore(data.pagination?.hasMore || false)
        setTotal(data.pagination?.total || 0)
        setPage(1)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchInitial()
  }, [])

  // Load more 
  const handleLoadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)
    try {
      const nextPage = page + 1
      const data = await getAllMusics(nextPage, LIMIT)
      setMusics((prev) => [...prev, ...(data.musics || [])])
      setHasMore(data.pagination?.hasMore || false)
      setPage(nextPage)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingMore(false)
    }
  }, [loadingMore, hasMore, page])

  return (
    <div className="max-w-3xl mx-auto" style={{ padding: "2.5rem 1.5rem" }}>

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
          {!loading && !error && total > 0 && (
            <span
              className="text-xs px-3 py-1 rounded-full"
              style={{
                backgroundColor: "var(--cream-dark)",
                color: "var(--charcoal-muted)",
              }}
            >
              {musics.length} of {total}
            </span>
          )}
        </div>

        {/* Track container */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: "1px solid var(--border)" }}
        >
          {/* Initial loading skeletons */}
          {loading && Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              style={{ borderBottom: i < 4 ? "1px solid var(--border)" : "none" }}
            >
              <TrackSkeleton />
            </div>
          ))}

          {/* Error */}
          {error && !loading && (
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

          {/* Empty state */}
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

          {/* Track rows */}
          {!loading && !error && musics.map((track, i) => (
            <div
              key={track._id}
              style={{
                borderBottom: i < musics.length - 1 || hasMore
                  ? "1px solid var(--border)"
                  : "none",
              }}
            >
              <MusicCard track={track} index={i} queue={musics} />
            </div>
          ))}

          {/* Load more skeletons */}
          {loadingMore && Array.from({ length: 3 }).map((_, i) => (
            <div
              key={`more-${i}`}
              style={{ borderBottom: i < 2 ? "1px solid var(--border)" : "none" }}
            >
              <TrackSkeleton />
            </div>
          ))}
        </div>

        {/* Load More button — outside the card container */}
        {!loading && !error && hasMore && (
          <div className="mt-4 flex justify-center">
            <Button
              onClick={handleLoadMore}
              disabled={loadingMore}
              variant="outline"
              className="rounded-full px-8 text-sm transition-all hover:scale-[1.02]"
              style={{
                borderColor: "var(--border)",
                color: "var(--charcoal)",
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              {loadingMore ? "Loading…" : `Load more tracks`}
            </Button>
          </div>
        )}

        {/* End of list indicator */}
        {!loading && !error && !hasMore && musics.length > 0 && (
          <p
            className="text-xs text-center mt-5"
            style={{ color: "var(--charcoal-muted)" }}
          >
            You've heard it all — {total} {total === 1 ? "track" : "tracks"} total
          </p>
        )}

      </section>
    </div>
  )
}