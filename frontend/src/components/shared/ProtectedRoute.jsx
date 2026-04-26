import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"

// requiredRole: "user" | "artist" | undefined (any authenticated user)
export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, isArtist } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiredRole === "artist" && !isArtist) {
    return <Navigate to="/home" replace />
  }

  return children
}