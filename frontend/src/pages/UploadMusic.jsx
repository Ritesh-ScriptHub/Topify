import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { uploadMusic } from "@/api/music.api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function UploadMusic() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [title, setTitle] = useState("")
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleFile = (f) => {
    if (!f) return
    if (!f.type.startsWith("audio/")) {
      setError("Only audio files are accepted (mp3, wav, flac…)")
      return
    }
    setError(null)
    setFile(f)
    // auto-fill title from filename if empty
    if (!title) {
      setTitle(f.name.replace(/\.[^.]+$/, ""))
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!title.trim()) { setError("Please enter a track title."); return }
    if (!file) { setError("Please select an audio file."); return }

    const formData = new FormData()
    formData.append("title", title.trim())
    formData.append("music", file)

    setLoading(true)
    try {
      await uploadMusic(formData)
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
          🎉
        </div>
        <h2
          className="font-display text-3xl font-semibold mb-3"
          style={{ color: "var(--charcoal)" }}
        >
          Track uploaded!
        </h2>
        <p className="text-sm mb-8" style={{ color: "var(--charcoal-muted)" }}>
          <span className="font-medium" style={{ color: "var(--charcoal)" }}>"{title}"</span>{" "}
          is now live on Topify.
        </p>
        <div className="flex gap-3 justify-center">
          <Button
            onClick={() => { setSuccess(false); setFile(null); setTitle("") }}
            variant="outline"
            className="rounded-full px-6"
            style={{ borderColor: "var(--border)", color: "var(--charcoal)" }}
          >
            Upload another
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

  // ── Upload form ──
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
          Upload a Track
        </h1>
        <p className="text-sm" style={{ color: "var(--charcoal-muted)" }}>
          Share your music with listeners on Topify.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="anim-fade-up anim-delay-2 space-y-6">

        {/* Title */}
        <div className="space-y-1.5">
          <Label
            htmlFor="title"
            className="text-sm font-medium"
            style={{ color: "var(--charcoal)" }}
          >
            Track Title
          </Label>
          <Input
            id="title"
            type="text"
            placeholder="Give your track a name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-xl h-11 text-sm"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
            }}
          />
        </div>

        {/* Drop zone */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium" style={{ color: "var(--charcoal)" }}>
            Audio File
          </Label>

          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className="w-full rounded-2xl transition-all cursor-pointer"
            style={{
              padding: "2.5rem 1.5rem",
              border: `2px dashed ${dragging ? "var(--amber)" : file ? "#86EFAC" : "var(--border)"}`,
              backgroundColor: dragging
                ? "var(--amber-pale)"
                : file
                ? "#F0FDF4"
                : "var(--surface)",
              textAlign: "center",
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />

            {file ? (
              <div>
                <p className="text-2xl mb-2">✅</p>
                <p
                  className="text-sm font-medium mb-1 truncate"
                  style={{ color: "var(--charcoal)" }}
                >
                  {file.name}
                </p>
                <p className="text-xs" style={{ color: "var(--charcoal-muted)" }}>
                  {(file.size / (1024 * 1024)).toFixed(2)} MB · Click to change
                </p>
              </div>
            ) : (
              <div>
                <p className="text-3xl mb-3">{dragging ? "🎵" : "📂"}</p>
                <p
                  className="text-sm font-medium mb-1"
                  style={{ color: "var(--charcoal)" }}
                >
                  {dragging ? "Drop it here" : "Drag & drop your audio file"}
                </p>
                <p className="text-xs" style={{ color: "var(--charcoal-muted)" }}>
                  or click to browse · mp3, wav, flac, aac supported
                </p>
              </div>
            )}
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
          disabled={loading}
          className="w-full rounded-xl h-11 text-sm font-medium hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "var(--amber)", color: "#fff" }}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
              Uploading…
            </span>
          ) : (
            "Upload Track"
          )}
        </Button>
      </form>
    </div>
  )
}