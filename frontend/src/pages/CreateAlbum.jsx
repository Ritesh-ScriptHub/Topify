import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getAllMusics, createAlbum } from "@/api/music.api"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"

function getGradient(str = "") {
  const h = (str.charCodeAt(0) * 7) % 360
  return `linear-gradient(135deg, hsl(${h},55%,70%), hsl(${h + 40},45%,60%))`
}

export default function CreateAlbum() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [tracks, setTracks] = useState([])
  const [selectedIds, setSelectedIds] = useState([])
  const [tracksLoading, setTracksLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    async function loadTracks() {
      try {
        const data = await getAllMusics(1, 50)
        const myTracks = (data.musics || []).filter(
          (t) => t.artist?._id === user.id || t.artist === user.id
        )
        setTracks(myTracks)
      } catch (err) {
        console.error(err)
      } finally {
        setTracksLoading(false)
      }
    }
    loadTracks()
  }, [user.id])

  const toggleTrack = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!title.trim()) { setError("Please enter an album title."); return }
    if (selectedIds.length === 0) { setError("Select at least one track for the album."); return }

    setLoading(true)
    try {
      await createAlbum({ title: title.trim(), musicIds: selectedIds })
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ── Success state ──
  if (success) {
    return (
      <div
        className="max-w-lg mx-auto text-center"
        style={{ padding: "5rem 1.5rem" }}
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-6"
          style={{ backgroundColor: "var(--amber-pale)" }}
        >
          📀
        </div>
        <h2
          className="font-display text-3xl font-semibold mb-3"
          style={{ color: "var(--charcoal)" }}
        >
          Album created!
        </h2>
        <p className="text-sm mb-8" style={{ color: "var(--charcoal-muted)" }}>
          <span className="font-medium" style={{ color: "var(--charcoal)" }}>"{title}"</span>{" "}
          is now live with {selectedIds.length} {selectedIds.length === 1 ? "track" : "tracks"}.
        </p>
        <div className="flex gap-3 justify-center">
          <Button
            onClick={() => { setSuccess(false); setTitle(""); setSelectedIds([]) }}
            variant="outline"
            className="rounded-full px-6"
            style={{ borderColor: "var(--border)", color: "var(--charcoal)" }}
          >
            Create another
          </Button>
          <Button
            onClick={() => navigate("/artist")}
            className="rounded-full px-6"
            style={{ backgroundColor: "var(--amber)", color: "#fff" }}
          >
            Back to Studio
          </Button>
        </div>
      </div>
    )
  }

  // ── Create form ──
  return (
    <div
      className="max-w-lg mx-auto"
      style={{ padding: "2.5rem 1.5rem" }}
    >
      {/* Header */}
      <div className="anim-fade-up anim-delay-1 mb-8">
        <button
          onClick={() => navigate("/artist")}
          className="flex items-center gap-2 text-sm mb-6 hover:opacity-70 transition-opacity"
          style={{ color: "var(--charcoal-muted)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          Artist Studio
        </button>
        <h1
          className="font-display text-4xl font-semibold mb-2"
          style={{ color: "var(--charcoal)" }}
        >
          Create an Album
        </h1>
        <p className="text-sm" style={{ color: "var(--charcoal-muted)" }}>
          Group your tracks into a full listening experience.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="anim-fade-up anim-delay-2 space-y-6">

        {/* Album title */}
        <div className="space-y-1.5">
          <Label
            htmlFor="albumTitle"
            className="text-sm font-medium"
            style={{ color: "var(--charcoal)" }}
          >
            Album Title
          </Label>
          <Input
            id="albumTitle"
            type="text"
            placeholder="Name your album"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-xl h-11 text-sm"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
            }}
          />
        </div>

        {/* Track selector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium" style={{ color: "var(--charcoal)" }}>
              Select Tracks
            </Label>
            {selectedIds.length > 0 && (
              <span
                className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{
                  backgroundColor: "var(--amber-pale)",
                  color: "var(--amber)",
                }}
              >
                {selectedIds.length} selected
              </span>
            )}
          </div>

          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: "1px solid var(--border)" }}
          >
            {/* Loading */}
            {tracksLoading && Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-4 py-3"
                style={{ borderBottom: i < 2 ? "1px solid var(--border)" : "none" }}
              >
                <Skeleton className="w-5 h-5 rounded" style={{ backgroundColor: "var(--cream-dark)" }} />
                <Skeleton className="w-9 h-9 rounded-lg" style={{ backgroundColor: "var(--cream-dark)" }} />
                <Skeleton className="h-3.5 w-1/2 rounded" style={{ backgroundColor: "var(--cream-dark)" }} />
              </div>
            ))}

            {/* No tracks */}
            {!tracksLoading && tracks.length === 0 && (
              <div className="px-6 py-10 text-center">
                <p className="text-xl mb-2">🎵</p>
                <p className="text-sm font-medium mb-1" style={{ color: "var(--charcoal)" }}>
                  No tracks yet
                </p>
                <p className="text-xs" style={{ color: "var(--charcoal-muted)" }}>
                  Upload some tracks first before creating an album.
                </p>
              </div>
            )}

            {/* Track rows */}
            {!tracksLoading && tracks.map((track, i) => {
              const selected = selectedIds.includes(track._id)
              return (
                <div
                  key={track._id}
                  role="checkbox"
                  aria-checked={selected}
                  tabIndex={0}
                  onClick={() => toggleTrack(track._id)}
                  onKeyDown={(e) => e.key === " " && toggleTrack(track._id)}
                  className="flex items-center gap-4 px-4 py-3 cursor-pointer transition-colors"
                  style={{
                    borderBottom: i < tracks.length - 1 ? "1px solid var(--border)" : "none",
                    backgroundColor: selected ? "var(--amber-pale)" : "transparent",
                  }}
                >
                  {/* Checkbox */}
                  <div
                    className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all"
                    style={{
                      backgroundColor: selected ? "var(--amber)" : "transparent",
                      border: `2px solid ${selected ? "var(--amber)" : "var(--border)"}`,
                    }}
                  >
                    {selected && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    )}
                  </div>

                  {/* Color dot */}
                  <div
                    className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center text-sm"
                    style={{ background: getGradient(track.title) }}
                  >
                    🎵
                  </div>

                  {/* Title */}
                  <p
                    className="text-sm font-medium flex-1 min-w-0 truncate"
                    style={{ color: selected ? "var(--amber)" : "var(--charcoal)" }}
                  >
                    {track.title}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            className="rounded-xl px-4 py-3 text-sm"
            style={{
              backgroundColor: "#FEF2F2",
              color: "#DC2626",
              border: "1px solid #FECACA",
            }}
          >
            {error}
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading || tracksLoading}
          className="w-full rounded-xl h-11 text-sm font-medium hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "var(--amber)", color: "#fff" }}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
              Creating…
            </span>
          ) : (
            `Create Album${selectedIds.length > 0 ? ` · ${selectedIds.length} track${selectedIds.length > 1 ? "s" : ""}` : ""}`
          )}
        </Button>
      </form>
    </div>
  )
}