import { createContext, useState, useRef, useEffect, useCallback } from "react"
import { useAuth } from "@/hooks/useAuth"
import { saveSession, loadSession } from "@/lib/playbackSession"

export const PlayerContext = createContext(null)

function shuffleArray(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function PlayerProvider({ children }) {
  const { user } = useAuth()
  const userId = user?._id || user?.id || null

  // Single Audio instance — lives for the app lifetime
  const audioRef = useRef(null)
  if (!audioRef.current) {
    audioRef.current = new Audio()
    audioRef.current.volume = 0.8
  }

  const [currentTrack, setCurrentTrack] = useState(null)
  const [queue, setQueue] = useState([])
  const [queueIndex, setQueueIndex] = useState(-1)
  const [isShuffle, setIsShuffle] = useState(false)
  const [shuffledQueue, setShuffledQueue] = useState([])
  const [shuffledQueueIndex, setShuffledQueueIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolumeState] = useState(0.8)
  const [isLoading, setIsLoading] = useState(false)
  const [audioError, setAudioError] = useState(null)

  // Ref for the save-throttle timer so it survives re-renders
  const saveTimerRef = useRef(null)
  // Keep latest state in refs so event listeners always read fresh values
  const stateRef = useRef({ currentTrack: null, queue: [], queueIndex: -1, currentTime: 0, isShuffle: false, shuffledQueue: [], shuffledQueueIndex: -1 })
  useEffect(() => {
    stateRef.current = { currentTrack, queue, queueIndex, currentTime, isShuffle, shuffledQueue, shuffledQueueIndex }
  }, [currentTrack, queue, queueIndex, currentTime, isShuffle, shuffledQueue, shuffledQueueIndex])

  // ── Static event listeners (no deps) ──────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current

    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onLoadedMeta = () => { setDuration(audio.duration); setIsLoading(false) }
    const onWaiting = () => setIsLoading(true)
    const onCanPlay = () => setIsLoading(false)
    const onAudioError = () => {
      setAudioError("Couldn't load this track.")
      setIsPlaying(false)
      setIsLoading(false)
    }

    audio.addEventListener("timeupdate", onTimeUpdate)
    audio.addEventListener("loadedmetadata", onLoadedMeta)
    audio.addEventListener("waiting", onWaiting)
    audio.addEventListener("canplay", onCanPlay)
    audio.addEventListener("error", onAudioError)

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate)
      audio.removeEventListener("loadedmetadata", onLoadedMeta)
      audio.removeEventListener("waiting", onWaiting)
      audio.removeEventListener("canplay", onCanPlay)
      audio.removeEventListener("error", onAudioError)
      audio.pause()
    }
  }, [])

  // ── "ended" listener — needs fresh queue/queueIndex/shuffle info ──────
  useEffect(() => {
    const audio = audioRef.current

    const onEnded = () => {
      const activeQueue = isShuffle ? shuffledQueue : queue
      const activeIdx = isShuffle ? shuffledQueueIndex : queueIndex
      const nextIdx = activeIdx + 1

      if (activeQueue.length > 0 && nextIdx < activeQueue.length) {
        // auto-advance
        const next = activeQueue[nextIdx]
        if (isShuffle) {
          setShuffledQueueIndex(nextIdx)
          const origIdx = queue.findIndex((t) => t._id === next._id)
          setQueueIndex(origIdx)
        } else {
          setQueueIndex(nextIdx)
        }
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
  }, [queue, queueIndex, isShuffle, shuffledQueue, shuffledQueueIndex])

  // ── Save session (throttled + beforeunload + visibilitychange) ─────────
  useEffect(() => {
    if (!userId) return
    const audio = audioRef.current

    // Save helper — grabs state from refs so it's always fresh
    const persistNow = () => {
      const s = stateRef.current
      if (s.currentTrack) {
        saveSession(userId, s)
      }
    }

    // Throttled save on timeupdate (every 3 s)
    const onTimeUpdate = () => {
      if (saveTimerRef.current) return
      saveTimerRef.current = setTimeout(() => {
        persistNow()
        saveTimerRef.current = null
      }, 3000)
    }

    // Immediate save when the tab is hidden or the window is closing
    const onVisChange = () => {
      if (document.visibilityState === "hidden") persistNow()
    }
    const onBeforeUnload = () => persistNow()

    audio.addEventListener("timeupdate", onTimeUpdate)
    document.addEventListener("visibilitychange", onVisChange)
    window.addEventListener("beforeunload", onBeforeUnload)

    return () => {
      persistNow()
      audio.removeEventListener("timeupdate", onTimeUpdate)
      document.removeEventListener("visibilitychange", onVisChange)
      window.removeEventListener("beforeunload", onBeforeUnload)
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
        saveTimerRef.current = null
      }
    }
  }, [userId])

  // ── Restore session on login ──────────────────────────────────────────
  const prevUserIdRef = useRef(null)
  const pendingRestoreRef = useRef(null)

  const cancelPendingRestore = useCallback(() => {
    if (pendingRestoreRef.current) {
      audioRef.current.removeEventListener("canplay", pendingRestoreRef.current)
      pendingRestoreRef.current = null
    }
  }, [])

  useEffect(() => {
    // Only restore when userId actually changes to a new truthy value
    if (!userId) {
      prevUserIdRef.current = null
      cancelPendingRestore()
      return
    }
    if (userId === prevUserIdRef.current) return
    prevUserIdRef.current = userId

    const saved = loadSession(userId)
    if (!saved || !saved.track) return

    const audio = audioRef.current
    setCurrentTrack(saved.track)
    setQueue(saved.queue || [])
    setQueueIndex(typeof saved.queueIndex === "number" ? saved.queueIndex : -1)
    setIsShuffle(!!saved.isShuffle)
    setShuffledQueue(saved.shuffledQueue || [])
    setShuffledQueueIndex(typeof saved.shuffledQueueIndex === "number" ? saved.shuffledQueueIndex : -1)
    setAudioError(null)
    setIsLoading(true)

    audio.src = saved.track.uri
    audio.load()

    // Once metadata is loaded, seek to saved position (stay paused)
    const onReady = () => {
      audio.currentTime = saved.currentTime || 0
      setCurrentTime(saved.currentTime || 0)
      setDuration(audio.duration || 0)
      setIsLoading(false)
      audio.removeEventListener("canplay", onReady)
      pendingRestoreRef.current = null
    }
    pendingRestoreRef.current = onReady
    audio.addEventListener("canplay", onReady)

    return () => {
      audio.removeEventListener("canplay", onReady)
    }
  }, [userId, cancelPendingRestore])

  // ── Actions ───────────────────────────────────────────────────────────
  const playTrack = useCallback((track, trackQueue = null) => {
    cancelPendingRestore()
    const audio = audioRef.current
    setAudioError(null)
    setCurrentTime(0)
    setDuration(0)
    setIsLoading(true)
    setCurrentTrack(track)

    if (trackQueue) {
      setQueue(trackQueue)
      const origIdx = trackQueue.findIndex((t) => t._id === track._id)
      setQueueIndex(origIdx)

      if (isShuffle) {
        const remaining = trackQueue.filter((t) => t._id !== track._id)
        const shuffledRemaining = shuffleArray(remaining)
        setShuffledQueue([track, ...shuffledRemaining])
        setShuffledQueueIndex(0)
      } else {
        setShuffledQueue([])
        setShuffledQueueIndex(-1)
      }
    } else {
      // single play — no queue context
      setQueue([])
      setQueueIndex(-1)
      setShuffledQueue([])
      setShuffledQueueIndex(-1)
    }

    audio.src = track.uri
    audio.load()
    audio.play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false))
  }, [cancelPendingRestore, isShuffle])

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
    cancelPendingRestore()
    audioRef.current.currentTime = time
    setCurrentTime(time)
  }, [cancelPendingRestore])

  const setVolume = useCallback((vol) => {
    audioRef.current.volume = vol
    setVolumeState(vol)
  }, [])

  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => {
      const newShuffle = !prev
      if (newShuffle) {
        if (queue.length > 0 && currentTrack) {
          const remaining = queue.filter((t) => t._id !== currentTrack._id)
          const shuffledRemaining = shuffleArray(remaining)
          const newShuffledQueue = [currentTrack, ...shuffledRemaining]
          setShuffledQueue(newShuffledQueue)
          setShuffledQueueIndex(0)
        } else {
          setShuffledQueue([])
          setShuffledQueueIndex(-1)
        }
      } else {
        if (queue.length > 0 && currentTrack) {
          const originalIdx = queue.findIndex((t) => t._id === currentTrack._id)
          setQueueIndex(originalIdx >= 0 ? originalIdx : -1)
        }
        setShuffledQueue([])
        setShuffledQueueIndex(-1)
      }
      return newShuffle
    })
  }, [queue, currentTrack])

  const playNext = useCallback(() => {
    cancelPendingRestore()
    const activeQueue = isShuffle ? shuffledQueue : queue
    const activeIdx = isShuffle ? shuffledQueueIndex : queueIndex
    const nextIdx = activeIdx + 1
    if (nextIdx >= activeQueue.length) return
    const next = activeQueue[nextIdx]

    if (isShuffle) {
      setShuffledQueueIndex(nextIdx)
      const origIdx = queue.findIndex((t) => t._id === next._id)
      setQueueIndex(origIdx)
    } else {
      setQueueIndex(nextIdx)
    }

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
  }, [queue, queueIndex, isShuffle, shuffledQueue, shuffledQueueIndex, cancelPendingRestore])

  const playPrev = useCallback(() => {
    cancelPendingRestore()
    const audio = audioRef.current
    // if >3s in — restart current track
    if (audio.currentTime > 3) {
      seek(0)
      return
    }
    const activeQueue = isShuffle ? shuffledQueue : queue
    const activeIdx = isShuffle ? shuffledQueueIndex : queueIndex
    const prevIdx = activeIdx - 1
    if (prevIdx < 0) return
    const prev = activeQueue[prevIdx]

    if (isShuffle) {
      setShuffledQueueIndex(prevIdx)
      const origIdx = queue.findIndex((t) => t._id === prev._id)
      setQueueIndex(origIdx)
    } else {
      setQueueIndex(prevIdx)
    }

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
  }, [queue, queueIndex, isShuffle, shuffledQueue, shuffledQueueIndex, seek, cancelPendingRestore])

  const stopTrack = useCallback(() => {
    cancelPendingRestore()
    const audio = audioRef.current
    audio.pause()
    audio.src = ""
    setCurrentTrack(null)
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
    setQueue([])
    setQueueIndex(-1)
    setShuffledQueue([])
    setShuffledQueueIndex(-1)
    setAudioError(null)
  }, [cancelPendingRestore])

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
      hasNext: isShuffle
        ? (shuffledQueue.length > 0 && shuffledQueueIndex < shuffledQueue.length - 1)
        : (queue.length > 0 && queueIndex < queue.length - 1),
      hasPrev: isShuffle
        ? (shuffledQueue.length > 0 && shuffledQueueIndex > 0)
        : (queue.length > 0 && queueIndex > 0),
      stopTrack,
      isShuffle,
      toggleShuffle,
    }}>
      {children}
    </PlayerContext.Provider>
  )
}