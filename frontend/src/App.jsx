import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "@/context/AuthContext"
import { PlayerProvider } from "@/context/PlayerContext"
import AppLayout from "@/components/layout/AppLayout"
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
                <AppLayout><Home /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/albums" element={
              <ProtectedRoute>
                <AppLayout><Albums /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/albums/:albumId" element={
              <ProtectedRoute>
                <AppLayout><AlbumDetail /></AppLayout>
              </ProtectedRoute>
            } />

            {/* Artists only */}
            <Route path="/artist" element={
              <ProtectedRoute requiredRole="artist">
                <AppLayout><ArtistDashboard /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/artist/upload" element={
              <ProtectedRoute requiredRole="artist">
                <AppLayout><UploadMusic /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/artist/create-album" element={
              <ProtectedRoute requiredRole="artist">
                <AppLayout><CreateAlbum /></AppLayout>
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