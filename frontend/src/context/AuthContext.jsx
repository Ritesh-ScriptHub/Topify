import { createContext, useState, useEffect, useCallback } from "react"
import { loginUser, registerUser, logoutUser } from "@/api/auth.api"

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // hydrate from localStorage on first load
    try {
      const stored = localStorage.getItem("topify_user")
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // keep localStorage in sync whenever user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("topify_user", JSON.stringify(user))
    } else {
      localStorage.removeItem("topify_user")
    }
  }, [user])

  const login = useCallback(async (credentials) => {
    setLoading(true)
    setError(null)
    try {
      const data = await loginUser(credentials)
      setUser(data.user)
      return { success: true, role: data.user.role }
    } catch (err) {
      setError(err.message)
      return { success: false, message: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (credentials) => {
    setLoading(true)
    setError(null)
    try {
      const data = await registerUser(credentials)
      setUser(data.user)
      return { success: true, role: data.user.role }
    } catch (err) {
      setError(err.message)
      return { success: false, message: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await logoutUser()
    } finally {
      // always clear local state even if API call fails
      setUser(null)
    }
  }, [])

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isArtist: user?.role === "artist",
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}