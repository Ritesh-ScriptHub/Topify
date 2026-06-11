import { usePlayer } from "@/hooks/usePlayer"

function formatTime(secs) {
  if (!secs || isNaN(secs)) return "0:00"
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

function getGradient(str = "") {
  const h = (str.charCodeAt(0) * 7) % 360
  return `linear-gradient(135deg, hsl(${h},55%,70%), hsl(${h + 40},45%,60%))`
}

export default function PlayerBar() {
  const {
    currentTrack,
    isPlaying,
    isLoading,
    audioError,
    duration,
    currentTime,
    volume,
    togglePlay,
    seek,
    setVolume,
    playNext,
    playPrev,
    hasNext,
    hasPrev,
    isShuffle,
    toggleShuffle,
  } = usePlayer()

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  const handleProgressClick = (e) => {
    if (!duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    seek(ratio * duration)
  }

  const handleVolumeClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    setVolume(ratio)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
      <div
        className="max-w-3xl mx-auto rounded-2xl shadow-xl overflow-hidden"
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      >
        {/* ── Main row ── */}
        <div className="flex flex-col px-4 pt-3 pb-3 gap-2">

          {/* ── Progress bar ── */}
          <div className="flex items-center gap-2">
            <span
              className="text-xs tabular-nums shrink-0"
              style={{
                color: "var(--charcoal-muted)",
                fontFamily: "'Outfit', sans-serif",
                minWidth: "32px",
              }}
            >
              {formatTime(currentTime)}
            </span>

            <div
              role="slider"
              aria-label="Seek"
              className="flex-1 h-1 cursor-pointer group relative my-2"
              style={{
                backgroundColor: "var(--cream-dark)",
                overflow: "visible",
              }}
              onClick={handleProgressClick}
            >
              {/* Filled */}
              <div
                className="h-full rounded-full transition-all duration-150"
                style={{ width: `${progress}%`, backgroundColor: "var(--amber)" }}
              />
              {/* Thumb */}
              <div
                className="absolute w-3 h-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  left: `${progress}%`,
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "var(--amber)",
                }}
              />
            </div>

            <span
              className="text-xs tabular-nums shrink-0"
              style={{
                color: "var(--charcoal-muted)",
                fontFamily: "'Outfit', sans-serif",
                minWidth: "32px",
                textAlign: "right",
              }}
            >
              {formatTime(duration)}
            </span>
          </div>

          {/* ── Track info + controls + volume ── */}
          <div className="flex items-center gap-3">

            {/* Track info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0"
                style={{
                  background: currentTrack
                    ? getGradient(currentTrack.title)
                    : "var(--cream-dark)",
                }}
              >
                {isLoading ? (
                  <svg
                    className="animate-spin w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--charcoal-muted)"
                    strokeWidth="2"
                  >
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                ) : "🎵"}
              </div>

              <div className="min-w-0">
                <p
                  className="text-sm font-medium truncate"
                  style={{
                    color: audioError ? "#DC2626" : "var(--charcoal)",
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  {audioError
                    ? audioError
                    : currentTrack?.title || "No track playing"}
                </p>
                <p
                  className="text-xs truncate"
                  style={{
                    color: "var(--charcoal-muted)",
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  {currentTrack
                    ? currentTrack.artist?.username || "Unknown Artist"
                    : "Select a song to play"}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={toggleShuffle}
                disabled={!currentTrack}
                className="w-8 h-8 flex flex-col items-center justify-center rounded-full transition-all hover:opacity-80 active:scale-95 disabled:opacity-25 relative"
                style={{
                  color: isShuffle ? "var(--amber)" : "var(--charcoal-muted)",
                }}
                aria-label={isShuffle ? "Disable Shuffle" : "Enable Shuffle"}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 3 21 3 21 8"></polyline>
                  <line x1="4" y1="20" x2="21" y2="3"></line>
                  <polyline points="21 16 21 21 16 21"></polyline>
                  <line x1="15" y1="15" x2="21" y2="21"></line>
                  <line x1="4" y1="4" x2="9" y2="9"></line>
                </svg>
                {isShuffle && (
                  <span
                    className="absolute bottom-0.5 w-1 h-1 rounded-full"
                    style={{ backgroundColor: "var(--amber)" }}
                  />
                )}
              </button>

              <button
                onClick={playPrev}
                disabled={!hasPrev && !currentTrack}
                className="w-8 h-8 flex items-center justify-center rounded-full transition-all hover:opacity-70 disabled:opacity-25"
                style={{ color: "var(--charcoal-muted)" }}
                aria-label="Previous"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
                </svg>
              </button>

              <button
                onClick={togglePlay}
                disabled={!currentTrack}
                className="w-10 h-10 flex items-center justify-center rounded-full transition-all hover:scale-105 active:scale-95 disabled:opacity-30"
                style={{ backgroundColor: "var(--amber)" }}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                ) : (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              <button
                onClick={playNext}
                disabled={!hasNext}
                className="w-8 h-8 flex items-center justify-center rounded-full transition-all hover:opacity-70 disabled:opacity-25"
                style={{ color: "var(--charcoal-muted)" }}
                aria-label="Next"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 18l8.5-6L6 6v12zm2-8.14L12.72 13 8 16.14V9.86zM16 6h2v12h-2z" />
                </svg>
              </button>
            </div>

            {/* Volume */}
            <div className="hidden sm:flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setVolume(volume > 0 ? 0 : 0.8)}
                className="transition-opacity hover:opacity-60"
                aria-label="Toggle mute"
              >
                {volume === 0 ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--charcoal-muted)">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--charcoal-muted)">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                  </svg>
                )}
              </button>

              <div
                role="slider"
                aria-label="Volume"
                className="w-16 h-1 rounded-full cursor-pointer"
                style={{ backgroundColor: "var(--cream-dark)" }}
                onClick={handleVolumeClick}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${volume * 100}%`,
                    backgroundColor: "var(--amber)",
                  }}
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}