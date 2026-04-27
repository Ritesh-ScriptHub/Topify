import { createContext, useState, useRef, useEffect, useCallback } from "react"

export const PlayerContext = createContext(null)

export function PlayerProvider({ children }) {
  // Single Audio instance — lives for the app lifetime
  const audioRef = useRef(null)
  if (!audioRef.current) {
    audioRef.current = new Audio()
    audioRef.current.volume = 0.8
  }

  const [currentTrack, setCurrentTrack]   = useState(null)
  const [queue, setQueue]                 = useState([])
  const [queueIndex, setQueueIndex]       = useState(-1)
  const [isPlaying, setIsPlaying]         = useState(false)
  const [duration, setDuration]           = useState(0)
  const [currentTime, setCurrentTime]     = useState(0)
  const [volume, setVolumeState]          = useState(0.8)
  const [isLoading, setIsLoading]         = useState(false)
  const [audioError, setAudioError]       = useState(null)

  // ── Static event listeners (no deps) ──────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current

    const onTimeUpdate    = () => setCurrentTime(audio.currentTime)
    const onLoadedMeta    = () => { setDuration(audio.duration); setIsLoading(false) }
    const onWaiting       = () => setIsLoading(true)
    const onCanPlay       = () => setIsLoading(false)
    const onAudioError    = () => {
      setAudioError("Couldn't load this track.")
      setIsPlaying(false)
      setIsLoading(false)
    }

    audio.addEventListener("timeupdate",     onTimeUpdate)
    audio.addEventListener("loadedmetadata", onLoadedMeta)
    audio.addEventListener("waiting",        onWaiting)
    audio.addEventListener("canplay",        onCanPlay)
    audio.addEventListener("error",          onAudioError)

    return () => {
      audio.removeEventListener("timeupdate",     onTimeUpdate)
      audio.removeEventListener("loadedmetadata", onLoadedMeta)
      audio.removeEventListener("waiting",        onWaiting)
      audio.removeEventListener("canplay",        onCanPlay)
      audio.removeEventListener("error",          onAudioError)
      audio.pause()
    }
  }, [])

  // ── "ended" listener — needs fresh queue/queueIndex ───────────────────
  useEffect(() => {
    const audio = audioRef.current

    const onEnded = () => {
      const nextIdx = queueIndex + 1
      if (queue.length > 0 && nextIdx < queue.length) {
        // auto-advance
        const next = queue[nextIdx]
        setQueueIndex(nextIdx)
        setCurrentTrack(next)
        setCurrentTime(0)
        setDuration(0)
        setIsLoading(true)
        setAudioError(null)
        audio.src = next.uri
        audio.load()
        audio.play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false))
      } else {
        setIsPlaying(false)
        setCurrentTime(0)
      }
    }

    audio.addEventListener("ended", onEnded)
    return () => audio.removeEventListener("ended", onEnded)
  }, [queue, queueIndex])

  // ── Actions ───────────────────────────────────────────────────────────
  const playTrack = useCallback((track, trackQueue = null) => {
    const audio = audioRef.current
    setAudioError(null)
    setCurrentTime(0)
    setDuration(0)
    setIsLoading(true)
    setCurrentTrack(track)

    if (trackQueue) {
      setQueue(trackQueue)
      setQueueIndex(trackQueue.findIndex((t) => t._id === track._id))
    } else {
      // single play — no queue context
      setQueue([])
      setQueueIndex(-1)
    }

    audio.src = track.uri
    audio.load()
    audio.play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false))
  }, [])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!currentTrack) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false))
    }
  }, [isPlaying, currentTrack])

  const seek = useCallback((time) => {
    audioRef.current.currentTime = time
    setCurrentTime(time)
  }, [])

  const setVolume = useCallback((vol) => {
    audioRef.current.volume = vol
    setVolumeState(vol)
  }, [])

  const playNext = useCallback(() => {
    const nextIdx = queueIndex + 1
    if (nextIdx >= queue.length) return
    const next = queue[nextIdx]
    setQueueIndex(nextIdx)
    const audio = audioRef.current
    setCurrentTrack(next)
    setAudioError(null)
    setCurrentTime(0)
    setDuration(0)
    setIsLoading(true)
    audio.src = next.uri
    audio.load()
    audio.play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false))
  }, [queue, queueIndex])

  const playPrev = useCallback(() => {
    const audio = audioRef.current
    // if >3s in — restart current track
    if (audio.currentTime > 3) {
      seek(0)
      return
    }
    const prevIdx = queueIndex - 1
    if (prevIdx < 0) return
    const prev = queue[prevIdx]
    setQueueIndex(prevIdx)
    setCurrentTrack(prev)
    setAudioError(null)
    setCurrentTime(0)
    setDuration(0)
    setIsLoading(true)
    audio.src = prev.uri
    audio.load()
    audio.play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false))
  }, [queue, queueIndex, seek])

  return (
    <PlayerContext.Provider value={{
      currentTrack,
      isPlaying,
      duration,
      currentTime,
      volume,
      isLoading,
      audioError,
      playTrack,
      togglePlay,
      seek,
      setVolume,
      playNext,
      playPrev,
      hasNext: queue.length > 0 && queueIndex < queue.length - 1,
      hasPrev: queue.length > 0 && queueIndex > 0,
    }}>
      {children}
    </PlayerContext.Provider>
  )
}