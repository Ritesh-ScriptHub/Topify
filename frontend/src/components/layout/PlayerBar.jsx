import { usePlayer } from "@/hooks/usePlayer"

export default function PlayerBar() {
  const { currentTrack, isPlaying, togglePlay } = usePlayer()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
      <div
        className="max-w-3xl mx-auto rounded-2xl px-5 py-3 flex items-center gap-4 shadow-xl"
        style={{
          backgroundColor: "var(--charcoal)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >

        {/* Track info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Thumbnail */}
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-lg"
            style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
          >
            {currentTrack ? "🎵" : "♪"}
          </div>

          <div className="min-w-0">
            <p
              className="text-sm font-medium truncate"
              style={{ color: "var(--cream)", fontFamily: "'Outfit', sans-serif" }}
            >
              {currentTrack?.title || "No track playing"}
            </p>
            <p
              className="text-xs truncate"
              style={{ color: "#78716C", fontFamily: "'Outfit', sans-serif" }}
            >
              {currentTrack?.artist?.username || "Select a song to play"}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 shrink-0">

          {/* Prev — stub */}
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:opacity-60"
            style={{ color: "#A8A29E" }}
            disabled={!currentTrack}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
            </svg>
          </button>

          {/* Play / Pause */}
          <button
            onClick={togglePlay}
            disabled={!currentTrack}
            className="w-10 h-10 flex items-center justify-center rounded-full transition-all hover:scale-105 disabled:opacity-40"
            style={{ backgroundColor: "var(--amber)" }}
          >
            {isPlaying ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Next — stub */}
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:opacity-60"
            style={{ color: "#A8A29E" }}
            disabled={!currentTrack}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 18l8.5-6L6 6v12zm2-8.14 4.72 3.14L8 16.14V9.86zM16 6h2v12h-2z" />
            </svg>
          </button>
        </div>

        {/* Volume — stub visual only */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#78716C">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
          </svg>
          <div
            className="w-20 h-1 rounded-full overflow-hidden"
            style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
          >
            <div
              className="h-full w-3/4 rounded-full"
              style={{ backgroundColor: "var(--amber)" }}
            />
          </div>
        </div>

      </div>
    </div>
  )
}