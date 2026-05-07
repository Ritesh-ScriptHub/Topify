import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { getArtistProfile } from "@/api/music.api"
import { useAuth } from "@/hooks/useAuth"
import MusicCard from "@/components/shared/MusicCard"
import AlbumCard from "@/components/shared/AlbumCard"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

function ProfileSkeleton() {
    return (
        <div style={{ padding: "2.5rem 1.5rem" }} className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-end gap-6">
            <Skeleton className="w-24 h-24 rounded-2xl shrink-0" style={{ backgroundColor: "var(--cream-dark)" }} />
            <div className="space-y-3 flex-1">
            <Skeleton className="h-9 w-1/3 rounded" style={{ backgroundColor: "var(--cream-dark)" }} />
            <Skeleton className="h-4 w-1/4 rounded" style={{ backgroundColor: "var(--cream-dark)" }} />
            <Skeleton className="h-4 w-1/5 rounded" style={{ backgroundColor: "var(--cream-dark)" }} />
            </div>
        </div>
        <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3">
                <Skeleton className="w-7 h-4 rounded" style={{ backgroundColor: "var(--cream-dark)" }} />
                <Skeleton className="w-9 h-9 rounded-lg" style={{ backgroundColor: "var(--cream-dark)" }} />
                <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-1/3 rounded" style={{ backgroundColor: "var(--cream-dark)" }} />
                <Skeleton className="h-3 w-1/5 rounded" style={{ backgroundColor: "var(--cream-dark)" }} />
                </div>
            </div>
            ))}
        </div>
        </div>
    )
}

function getAvatarGradient(str = "") {
    if (!str) return "linear-gradient(145deg, hsl(28,70%,75%), hsl(15,65%,60%))"
    const pairs = [
        ["hsl(28,70%,75%)", "hsl(15,65%,60%)"],
        ["hsl(200,55%,72%)", "hsl(220,50%,60%)"],
        ["hsl(340,55%,75%)", "hsl(300,45%,62%)"],
        ["hsl(160,50%,70%)", "hsl(180,45%,58%)"],
        ["hsl(45,70%,75%)", "hsl(30,65%,60%)"],
    ]
  const idx = str.charCodeAt(0) % pairs.length
  return `linear-gradient(145deg, ${pairs[idx][0]}, ${pairs[idx][1]})`
}

export default function ArtistProfile() {
    const { username } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()

    const [profile, setProfile]   = useState(null)
    const [loading, setLoading]   = useState(true)
    const [error, setError]       = useState(null)
    const [followed, setFollowed] = useState(false) // no backend for now

    const isOwnProfile = user?.username === username

    useEffect(() => {
        async function fetch() {
            try {
                const data = await getArtistProfile(username)
                setProfile(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetch()
    }, [username])

    if (loading) return <ProfileSkeleton />

    if (error) {
        return (
        <div className="max-w-4xl mx-auto text-center" style={{ padding: "5rem 1.5rem" }}>
            <p className="text-3xl mb-3">😕</p>
            <p className="text-sm font-medium mb-4" style={{ color: "var(--charcoal)" }}>
            {error}
            </p>
            <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="rounded-full"
            style={{ borderColor: "var(--border)", color: "var(--charcoal)" }}
            >
            ← Go back
            </Button>
        </div>
        )
    }

    const { artist, tracks, albums } = profile

    return (
        <div className="max-w-4xl mx-auto" style={{ padding: "2.5rem 1.5rem" }}>

            {/* Back */}
            <button
                onClick={() => navigate(-1)}
                className="anim-fade-up anim-delay-1 flex items-center gap-2 text-sm mb-8 hover:opacity-70 transition-opacity"
                style={{ color: "var(--charcoal-muted)" }}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                </svg>
                Back
            </button>

            {/* Profile hero */}
            <div className="anim-fade-up anim-delay-2 flex flex-col sm:flex-row items-start sm:items-end gap-6 mb-10">

                {/* Avatar */}
                <div
                className="w-24 h-24 rounded-2xl flex items-center justify-center text-4xl shrink-0 shadow-lg"
                style={{ background: getAvatarGradient(artist.username) }}
                >
                🎙️
                </div>

                {/* Meta */}
                <div className="flex-1 min-w-0">
                    <p
                        className="text-xs font-medium uppercase tracking-widest mb-1"
                        style={{ color: "var(--charcoal-muted)" }}
                    >
                        Artist
                    </p>
                    <h1
                        className="font-display text-4xl font-semibold mb-2 truncate"
                        style={{ color: "var(--charcoal)" }}
                    >
                        {artist.username}
                    </h1>

                    {/* Stats row */}
                    <div className="flex items-center gap-4 flex-wrap">
                        <span className="text-sm" style={{ color: "var(--charcoal-muted)" }}>
                        <span className="font-semibold" style={{ color: "var(--charcoal)" }}>
                            {tracks.length}
                        </span>{" "}
                        {tracks.length === 1 ? "track" : "tracks"}
                        </span>
                        <span style={{ color: "var(--border)" }}>·</span>
                        <span className="text-sm" style={{ color: "var(--charcoal-muted)" }}>
                        <span className="font-semibold" style={{ color: "var(--charcoal)" }}>
                            {albums.length}
                        </span>{" "}
                        {albums.length === 1 ? "album" : "albums"}
                        </span>
                    </div>
                </div>

                {!isOwnProfile && (
                <button
                    onClick={() => setFollowed((f) => !f)}
                    className="shrink-0 px-6 py-2 rounded-full text-sm font-medium transition-all hover:scale-[1.02]"
                    style={{
                    backgroundColor: followed ? "var(--cream-dark)" : "var(--charcoal)",
                    color: followed ? "var(--charcoal)" : "var(--cream)",
                    border: `1px solid ${followed ? "var(--border)" : "var(--charcoal)"}`,
                    fontFamily: "'Outfit', sans-serif",
                    }}
                >
                    {followed ? "Following ✓" : "Follow"}
                </button>
                )}

                {/* Own profile — link to studio */}
                {isOwnProfile && (
                <Link to="/artist">
                    <Button variant="outline" className="rounded-full px-6 text-sm shrink-0" style={{
                        borderColor: "var(--border)",
                        color: "var(--charcoal)",
                        fontFamily: "'Outfit', sans-serif",}} >
                        Go to Studio →
                    </Button>
                </Link>
                )}
            </div>

            {/* Tracks */}
            <section className="anim-fade-up anim-delay-3 mb-12">
                <h2 className="font-display text-xl font-medium mb-5" style={{ color: "var(--charcoal)" }} >
                Tracks
                </h2>

                {tracks.length === 0 ? (
                    <div className="rounded-2xl px-6 py-12 text-center" style={{ border: "1px solid var(--border)" }} >
                        <p className="text-2xl mb-2">🎵</p>
                        <p className="text-sm" style={{ color: "var(--charcoal-muted)" }}> No tracks uploaded yet. </p>
                    </div> ) : (
                    <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }} >
                        {tracks.map((track, i) => (
                        <div key={track._id}
                            style={{ borderBottom: i < tracks.length - 1 ? "1px solid var(--border)" : "none", }} >
                            <MusicCard track={track} index={i} queue={tracks} />
                        </div> ))}
                    </div>
                )}
            </section>

            {/* Albums */}
            {albums.length > 0 && (
                <section className="anim-fade-up anim-delay-4">
                <h2 className="font-display text-xl font-medium mb-5" style={{ color: "var(--charcoal)" }} >
                    Albums
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                    {albums.map((album) => ( <AlbumCard key={album._id} album={album} /> ))}
                </div>
                </section>
            )}
        </div>
    )
}