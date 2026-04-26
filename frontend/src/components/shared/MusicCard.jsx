import { usePlayer } from "@/hooks/usePlayer"

// generates a stable warm gradient from a string
function getGradient(str = "") {
  const hues = [28, 15, 340, 200, 160, 45]
  const idx = str.charCodeAt(0) % hues.length
  const h = hues[idx]
  return `linear-gradient(135deg, hsl(${h},60%,72%), hsl(${h + 40},50%,60%))`
}

export default function MusicCard({ track, index }) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer()

  const isActive = currentTrack?._id === track._id
  const isThisPlaying = isActive && isPlaying

  const handlePlay = () => {
    if (isActive) {
      togglePlay()
    } else {
      playTrack(track)
    }
  }

  return (
    <div
      className="group flex items-center gap-4 px-4 py-3 rounded-xl transition-all cursor-pointer"
      style={{
        backgroundColor: isActive ? "var(--amber-pale)" : "transparent",
        borderLeft: isActive ? "3px solid var(--amber)" : "3px solid transparent",
      }}
      onClick={handlePlay}
    >
      {/* Index / Play toggle */}
      <div className="w-7 flex items-center justify-center shrink-0">
        <span
          className="text-sm font-medium group-hover:hidden transition-all"
          style={{ color: isActive ? "var(--amber)" : "var(--charcoal-muted)" }}
        >
          {isThisPlaying ? (
            // animated bars when playing
            <span className="flex items-end gap-[2px] h-4">
              {[1, 2, 3].map((i) => (
                <span
                  key={i}
                  className="w-[3px] rounded-full"
                  style={{
                    backgroundColor: "var(--amber)",
                    height: `${8 + i * 3}px`,
                    animation: `bounce 0.8s ease-in-out ${i * 0.15}s infinite alternate`,
                  }}
                />
              ))}
            </span>
          ) : (
            index + 1
          )}
        </span>

        {/* Play/Pause icon on hover */}
        <button
          className="hidden group-hover:flex w-7 h-7 items-center justify-center rounded-full transition-all hover:scale-110"
          style={{ backgroundColor: "var(--charcoal)", color: "var(--cream)" }}
          onClick={(e) => { e.stopPropagation(); handlePlay() }}
        >
          {isThisPlaying ? (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      </div>

      {/* Track colour dot */}
      <div
        className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center text-sm"
        style={{ background: getGradient(track.title) }}
      >
        🎵
      </div>

      {/* Title + artist */}
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-medium truncate"
          style={{
            color: isActive ? "var(--amber)" : "var(--charcoal)",
            fontFamily: "'Outfit', sans-serif",
          }}
        >
          {track.title}
        </p>
        <p
          className="text-xs truncate mt-0.5"
          style={{ color: "var(--charcoal-muted)" }}
        >
          {track.artist?.username || "Unknown Artist"}
        </p>
      </div>
    </div>
  )
}