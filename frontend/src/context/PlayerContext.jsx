import { createContext, useState } from "react"

export const PlayerContext = createContext(null)

export function PlayerProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const playTrack = (track) => {
    setCurrentTrack(track)
    setIsPlaying(true)
  }

  const togglePlay = () => setIsPlaying((prev) => !prev)

  const stopTrack = () => {
    setCurrentTrack(null)
    setIsPlaying(false)
  }

  return (
    <PlayerContext.Provider value={{ currentTrack, isPlaying, playTrack, togglePlay, stopTrack }}>
      {children}
    </PlayerContext.Provider>
  )
}