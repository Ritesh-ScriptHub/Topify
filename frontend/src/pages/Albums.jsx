import { useEffect, useState } from "react"
import { getAllAlbums } from "@/api/music.api"
import AlbumCard from "@/components/shared/AlbumCard"
import { Skeleton } from "@/components/ui/skeleton"

function AlbumSkeleton() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: "1px solid var(--border)" }}
    >
      <Skeleton
        className="w-full aspect-square"
        style={{ backgroundColor: "var(--cream-dark)" }}
      />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4 rounded" style={{ backgroundColor: "var(--cream-dark)" }} />
        <Skeleton className="h-3 w-1/2 rounded" style={{ backgroundColor: "var(--cream-dark)" }} />
      </div>
    </div>
  )
}

export default function Albums() {
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchAlbums() {
      try {
        const data = await getAllAlbums()
        setAlbums(data.albums || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchAlbums()
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="mb-10 anim-fade-up anim-delay-1">
        <h1
          className="font-display text-4xl font-semibold mb-2"
          style={{ color: "var(--charcoal)" }}
        >
          Albums
        </h1>
        <p className="text-sm" style={{ color: "var(--charcoal-muted)" }}>
          Full album experiences from artists on Topify
        </p>
      </div>

      {/* Error */}
      {error && (
        <div
          className="rounded-2xl px-6 py-10 text-center"
          style={{ border: "1px solid var(--border)" }}
        >
          <p className="text-2xl mb-2">😕</p>
          <p className="text-sm font-medium" style={{ color: "var(--charcoal)" }}>
            Couldn't load albums
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--charcoal-muted)" }}>
            {error}
          </p>
        </div>
      )}

      {/* Grid */}
      {!error && (
        <div className="anim-fade-up anim-delay-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">

          {loading && Array.from({ length: 8 }).map((_, i) => (
            <AlbumSkeleton key={i} />
          ))}

          {!loading && albums.length === 0 && (
            <div className="col-span-full py-16 text-center">
              <p className="text-3xl mb-3">📀</p>
              <p
                className="text-sm font-medium mb-1"
                style={{ color: "var(--charcoal)" }}
              >
                No albums yet
              </p>
              <p className="text-xs" style={{ color: "var(--charcoal-muted)" }}>
                Artists haven't created any albums. Check back soon!
              </p>
            </div>
          )}

          {!loading && albums.map((album) => (
            <AlbumCard key={album._id} album={album} />
          ))}
        </div>
      )}
    </div>
  )
}