/**
 * Playback Session Persistence
 *
 * Saves / restores the player state per-user in localStorage.
 * Key format: `topify_session_<userId>`
 *
 * Stored shape:
 *   { track, queue, queueIndex, currentTime, savedAt }
 */

const PREFIX = "topify_session_"

function keyFor(userId) {
  return `${PREFIX}${userId}`
}

/**
 * Persist the current playback session for a user.
 */
export function saveSession(userId, { currentTrack, queue, queueIndex, currentTime }) {
  if (!userId || !currentTrack) return
  try {
    const payload = {
      track: currentTrack,
      queue,
      queueIndex,
      currentTime,
      savedAt: Date.now(),
    }
    localStorage.setItem(keyFor(userId), JSON.stringify(payload))
  } catch {
    // localStorage full or unavailable — silently ignore
  }
}

/**
 * Load the saved playback session for a user.
 * Returns `null` if nothing is stored or the data is corrupt.
 */
export function loadSession(userId) {
  if (!userId) return null
  try {
    const key = keyFor(userId)
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const data = JSON.parse(raw)
    // basic shape validation
    if (!data.track || typeof data.currentTime !== "number") return null
    return data
  } catch {
    return null
  }
}

/**
 * Remove a user's saved session (e.g. when they finish a full playlist).
 */
export function clearSession(userId) {
  if (!userId) return
  try {
    localStorage.removeItem(keyFor(userId))
  } catch {
    // ignore
  }
}
