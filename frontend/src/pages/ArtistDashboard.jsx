import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { getAllMusics, getAllAlbums } from "@/api/music.api"
import { Skeleton } from "@/components/ui/skeleton"

function StatCard({ label, value, loading }) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
    >
      {loading ? (
        <>
          <Skeleton className="h-8 w-12 mb-2 rounded" style={{ backgroundColor: "var(--cream-dark)" }} />
          <Skeleton className="h-3 w-20 rounded" style={{ backgroundColor: "var(--cream-dark)" }} />
        </>
      ) : (
        <>
          <p className="font-display text-3xl font-semibold mb-1" style={{ color: "var(--charcoal)" }}>
            {value}
          </p>
          <p className="text-xs" style={{ color: "var(--charcoal-muted)" }}>{label}</p>
        </>
      )}
    </div>
  )
}

const ACTIONS = [
  {
    to: "/artist/upload",
    icon: "🎵",
    label: "Upload a Track",
    desc: "Add a new song to your catalogue",
    accent: "var(--amber)",
    pale: "var(--amber-pale)",
  },
  {
    to: "/artist/create-album",
    icon: "📀",
    label: "Create an Album",
    desc: "Group your tracks into a full album",
    accent: "var(--charcoal)",
    pale: "var(--cream-dark)",
  },
]

export default function ArtistDashboard() {
  const { user } = useAuth()

  const [tracks, setTracks] = useState([])
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [musicData, albumData] = await Promise.all([
          getAllMusics(1, 50),
          getAllAlbums(),
        ])
        const myTracks = (musicData.musics || []).filter(
          (t) => t.artist?._id === user.id || t.artist === user.id
        )
        const myAlbums = (albumData.albums || []).filter(
          (a) => a.artist?._id === user.id || a.artist === user.id
        )
        setTracks(myTracks)
        setAlbums(myAlbums)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user.id])

  return (
    <div
      className="max-w-4xl mx-auto"
      style={{ padding: "2.5rem 1.5rem" }}
    >
      {/* Header */}
      <div className="anim-fade-up anim-delay-1 mb-10">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-4"
          style={{
            backgroundColor: "var(--amber-pale)",
            color: "var(--amber)",
            border: "1px solid #F5A36A55",
          }}
        >
          🎙️ Artist Studio
        </div>
        <h1
          className="font-display text-4xl font-semibold"
          style={{ color: "var(--charcoal)" }}
        >
          Welcome back, {user?.username}
        </h1>
        <p className="text-sm mt-2" style={{ color: "var(--charcoal-muted)" }}>
          Manage your music, grow your audience.
        </p>
      </div>

      {/* Stats */}
      <div className="anim-fade-up anim-delay-2 grid grid-cols-2 gap-4 mb-10">
        <StatCard label="Tracks uploaded" value={tracks.length} loading={loading} />
        <StatCard label="Albums created" value={albums.length} loading={loading} />
      </div>

      {/* Action cards */}
      <div className="anim-fade-up anim-delay-3 grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        {ACTIONS.map((action) => (
          <Link key={action.to} to={action.to} className="group block">
            <div
              className="rounded-2xl p-6 h-full transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                style={{ backgroundColor: action.pale }}
              >
                {action.icon}
              </div>
              <p
                className="font-display text-lg font-medium mb-1"
                style={{ color: "var(--charcoal)" }}
              >
                {action.label}
              </p>
              <p className="text-sm" style={{ color: "var(--charcoal-muted)" }}>
                {action.desc}
              </p>
              <p
                className="text-sm font-medium mt-4 group-hover:underline underline-offset-4"
                style={{ color: action.accent }}
              >
                Get started →
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent tracks */}
      <section className="anim-fade-up anim-delay-4">
        <h2
          className="font-display text-xl font-medium mb-5"
          style={{ color: "var(--charcoal)" }}
        >
          Your Tracks
        </h2>

        {loading ? (
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: "1px solid var(--border)" }}
          >
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-4 py-3"
                style={{ borderBottom: i < 2 ? "1px solid var(--border)" : "none" }}
              >
                <Skeleton className="w-7 h-4 rounded" style={{ backgroundColor: "var(--cream-dark)" }} />
                <Skeleton className="w-9 h-9 rounded-lg" style={{ backgroundColor: "var(--cream-dark)" }} />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-1/3 rounded" style={{ backgroundColor: "var(--cream-dark)" }} />
                  <Skeleton className="h-3 w-1/5 rounded" style={{ backgroundColor: "var(--cream-dark)" }} />
                </div>
              </div>
            ))}
          </div>
        ) : tracks.length === 0 ? (
          <div
            className="rounded-2xl px-6 py-14 text-center"
            style={{ border: "1px solid var(--border)" }}
          >
            <p className="text-3xl mb-3">🎵</p>
            <p className="text-sm font-medium mb-1" style={{ color: "var(--charcoal)" }}>
              No tracks yet
            </p>
            <p className="text-xs" style={{ color: "var(--charcoal-muted)" }}>
              Upload your first track to get started.
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
                className="flex items-center gap-4 px-4 py-3"
                style={{
                  borderBottom: i < tracks.length - 1 ? "1px solid var(--border)" : "none",
                }}
              >
                {/* Index */}
                <span
                  className="w-7 text-center text-sm shrink-0"
                  style={{ color: "var(--charcoal-muted)" }}
                >
                  {i + 1}
                </span>

                {/* Color dot */}
                <div
                  className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center text-sm"
                  style={{
                    background: `linear-gradient(135deg, hsl(${(track.title.charCodeAt(0) * 7) % 360},55%,70%), hsl(${(track.title.charCodeAt(0) * 7 + 40) % 360},45%,60%))`,
                  }}
                >
                  🎵
                </div>

                {/* Title only — artist is always "you" on this page */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium truncate"
                    style={{ color: "var(--charcoal)" }}
                  >
                    {track.title}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--charcoal-muted)" }}>
                    by you
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}