const PREFIX = "topify_session_"

function keyFor(userId) {
  return `${PREFIX}${userId}`
}

export function saveSession(userId, { currentTrack, queue, queueIndex, currentTime, isShuffle, shuffledQueue, shuffledQueueIndex }) {
  if (!userId || !currentTrack) return
  try {
    const payload = {
      track: currentTrack,
      queue,
      queueIndex,
      currentTime,
      isShuffle,
      shuffledQueue,
      shuffledQueueIndex,
      savedAt: Date.now(),
    }
    localStorage.setItem(keyFor(userId), JSON.stringify(payload))
  } catch {
    // localStorage full or unavailable — silently ignore
  }
}

export function loadSession(userId) {
  if (!userId) return null
  try {
    const key = keyFor(userId)
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const data = JSON.parse(raw)

    if (!data.track || typeof data.currentTime !== "number") return null
    return data
  } catch {
    return null
  }
}


export function clearSession(userId) {
  if (!userId) return
  try {
    localStorage.removeItem(keyFor(userId))
  } catch {
    // ignore
  }
}
