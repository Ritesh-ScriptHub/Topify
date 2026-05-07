import { useState, useEffect, useCallback, useRef } from "react"
import { useSearchParams } from "react-router-dom"
import { searchAll } from "@/api/music.api"
import MusicCard from "@/components/shared/MusicCard"
import AlbumCard from "@/components/shared/AlbumCard"
import ArtistCard from "@/components/shared/ArtistCard"
import { Skeleton } from "@/components/ui/skeleton"

function ResultSkeleton({ count = 3 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-3">
          <Skeleton className="w-11 h-11 rounded-xl shrink-0" style={{ backgroundColor: "var(--cream-dark)" }} />
          <div className="flex-1 space-y-2">
              <Skeleton className="h-3.5 w-1/3 rounded" style={{ backgroundColor: "var(--cream-dark)" }} />
              <Skeleton className="h-3 w-1/5 rounded" style={{ backgroundColor: "var(--cream-dark)" }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function SectionHeader({ title, count }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="font-display text-xl font-medium" style={{ color: "var(--charcoal)" }}>
        {title}
      </h2>
      <span
        className="text-xs px-3 py-1 rounded-full"
        style={{
          backgroundColor: "var(--cream-dark)",
          color: "var(--charcoal-muted)",
        }}
      >
        {count} {count === 1 ? "result" : "results"}
      </span>
    </div>
  )
}

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const [query, setQuery]     = useState(initialQuery)
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const inputRef    = useRef(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // run search if URL already has a query on mount
  useEffect(() => {
    if (initialQuery.length >= 2) {
      runSearch(initialQuery)
    }
  }, [])

  const runSearch = useCallback(async (q) => {
    setLoading(true)
    setError(null)
    try {
      const data = await searchAll(q)
      setResults(data)
    } catch (err) {
      setError(err.message)
      setResults(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleChange = (e) => {
    const val = e.target.value
    setQuery(val)

    // sync query to URL
    if (val) {
      setSearchParams({ q: val }, { replace: true })
    } else {
      setSearchParams({}, { replace: true })
      setResults(null)
    }

    // debounce — fire after 400ms of no typing
    clearTimeout(debounceRef.current)
    if (val.length >= 2) {
      debounceRef.current = setTimeout(() => runSearch(val), 500)
    } else {
      setResults(null)
    }
  }

  // cleanup debounce on unmount
  useEffect(() => () => clearTimeout(debounceRef.current), [])

  const hasResults = results &&
    (results.tracks.length > 0 || results.albums.length > 0 || results.artists.length > 0)

  const noResults = results &&
    results.tracks.length === 0 &&
    results.albums.length === 0 &&
    results.artists.length === 0

  return (
    <div className="max-w-3xl mx-auto" style={{ padding: "2.5rem 1.5rem" }}>

      {/* ── Search header ── */}
      <div className="anim-fade-up anim-delay-1 mb-8">
        <h1
          className="font-display text-4xl font-semibold mb-6"
          style={{ color: "var(--charcoal)" }}
        >
          Search
        </h1>

        {/* Input */}
        <div
          className="flex items-center gap-3 px-4 rounded-2xl transition-all"
          style={{
            backgroundColor: "var(--surface)",
            border: "2px solid var(--border)",
          }}
          onFocus={(e) =>
            e.currentTarget.style.setProperty("border-color", "var(--amber)")
          }
          onBlur={(e) =>
            e.currentTarget.style.setProperty("border-color", "var(--border)")
          }
        >
          {/* Search icon */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="var(--charcoal-muted)"
            className="shrink-0"
          >
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            placeholder="Search tracks, albums, artists…"
            className="flex-1 h-12 text-sm bg-transparent outline-none"
            style={{
              color: "var(--charcoal)",
              fontFamily: "'Outfit', sans-serif",
            }}
          />

          {/* Clear button */}
          {query && (
            <button
              onClick={() => {
                setQuery("")
                setResults(null)
                setSearchParams({}, { replace: true })
                inputRef.current?.focus()
              }}
              className="shrink-0 hover:opacity-60 transition-opacity"
              aria-label="Clear search"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--charcoal-muted)">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          )}
        </div>

        {/* Min chars hint */}
        {query.length === 1 && (
          <p className="text-xs mt-2 ml-1" style={{ color: "var(--charcoal-muted)" }}>
            Type at least 2 characters to search
          </p>
        )}
      </div>

      {/* ── States ── */}

      {/* Empty query */}
      {!query && (
        <div className="anim-fade-up anim-delay-2 text-center py-16">
          <p className="text-4xl mb-4">🔍</p>
          <p
            className="font-display text-xl font-medium mb-2"
            style={{ color: "var(--charcoal)" }}
          >
            Find your sound
          </p>
          <p className="text-sm" style={{ color: "var(--charcoal-muted)" }}>
            Search for tracks, albums or artists
          </p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-10">
          <div>
            <Skeleton className="h-6 w-24 rounded mb-4" style={{ backgroundColor: "var(--cream-dark)" }} />
            <ResultSkeleton count={3} />
          </div>
          <div>
            <Skeleton className="h-6 w-24 rounded mb-4" style={{ backgroundColor: "var(--cream-dark)" }} />
            <ResultSkeleton count={2} />
          </div>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="text-center py-12">
          <p className="text-2xl mb-2">😕</p>
          <p className="text-sm" style={{ color: "var(--charcoal-muted)" }}>{error}</p>
        </div>
      )}

      {/* No results */}
      {noResults && !loading && (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">🎵</p>
          <p
            className="font-display text-xl font-medium mb-2"
            style={{ color: "var(--charcoal)" }}
          >
            No results for "{query}"
          </p>
          <p className="text-sm" style={{ color: "var(--charcoal-muted)" }}>
            Try a different spelling or search term
          </p>
        </div>
      )}

      {/* ── Results ── */}
      {hasResults && !loading && (
        <div className="space-y-10 anim-fade-up anim-delay-2">

          {/* Tracks */}
          {results.tracks.length > 0 && (
            <section>
              <SectionHeader title="Tracks" count={results.tracks.length} />
              <div
                className="rounded-2xl overflow-hidden"
                style={{ border: "1px solid var(--border)" }}
              >
                {results.tracks.map((track, i) => (
                  <div
                    key={track._id}
                    style={{
                      borderBottom:
                        i < results.tracks.length - 1
                          ? "1px solid var(--border)"
                          : "none",
                    }}
                  >
                    <MusicCard
                      track={track}
                      index={i}
                      queue={results.tracks}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Albums */}
          {results.albums.length > 0 && (
            <section>
              <SectionHeader title="Albums" count={results.albums.length} />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {results.albums.map((album) => (
                  <AlbumCard key={album._id} album={album} />
                ))}
              </div>
            </section>
          )}

          {/* Artists */}
          {results.artists.length > 0 && (
            <section>
              <SectionHeader title="Artists" count={results.artists.length} />
              <div className="space-y-2">
                {results.artists.map((artist) => (
                  <ArtistCard key={artist._id} artist={artist} />
                ))}
              </div>
            </section>
          )}

        </div>
      )}
    </div>
  )
}