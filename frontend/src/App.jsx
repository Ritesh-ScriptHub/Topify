import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "@/context/AuthContext"
import { PlayerProvider } from "@/context/PlayerContext"
import ProtectedRoute from "@/components/shared/ProtectedRoute"

// Pages
import Landing from "@/pages/Landing"
import Login from "@/pages/Login"
import Register from "@/pages/Register"
import Home from "@/pages/Home"
import Albums from "@/pages/Albums"
import AlbumDetail from "@/pages/AlbumDetail"
import ArtistDashboard from "@/pages/ArtistDashboard"
import UploadMusic from "@/pages/UploadMusic"
import CreateAlbum from "@/pages/CreateAlbum"

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PlayerProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Any authenticated user */}
            <Route path="/home" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/albums" element={
              <ProtectedRoute>
                <Albums />
              </ProtectedRoute>
            } />
            <Route path="/albums/:albumId" element={
              <ProtectedRoute>
                <AlbumDetail />
              </ProtectedRoute>
            } />

            {/* Artists only */}
            <Route path="/artist" element={
              <ProtectedRoute requiredRole="artist">
                <ArtistDashboard />
              </ProtectedRoute>
            } />
            <Route path="/artist/upload" element={
              <ProtectedRoute requiredRole="artist">
                <UploadMusic />
              </ProtectedRoute>
            } />
            <Route path="/artist/create-album" element={
              <ProtectedRoute requiredRole="artist">
                <CreateAlbum />
              </ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PlayerProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}