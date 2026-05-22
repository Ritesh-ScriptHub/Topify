import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "@/context/AuthContext"
import { PlayerProvider } from "@/context/PlayerContext"
import AppLayout from "@/components/layout/AppLayout"
import ProtectedRoute from "@/components/shared/ProtectedRoute"

// Pages
import Landing from "@/pages/Landing"
import Home from "@/pages/Home"
import Albums from "@/pages/Albums"
import AlbumDetail from "@/pages/AlbumDetail"
import ArtistDashboard from "@/pages/ArtistDashboard"
import ArtistProfile from "@/pages/ArtistProfile"
import UploadMusic from "@/pages/UploadMusic"
import CreateAlbum from "@/pages/CreateAlbum"
import Search from "@/pages/Search"
import LoginSignup from "@/pages/auth/LoginSignup"
import VerifyEmail from "./pages/VerifyEmail"

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PlayerProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<LoginSignup />} />
            <Route path="/register" element={<Navigate to="/login" replace />} />
            <Route path="/verify-email" element={<VerifyEmail />} />

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
            <Route path="/artist/:username" element={
              <ProtectedRoute>
                <AppLayout><ArtistProfile /></AppLayout>
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
            <Route path="/search" element={
              <ProtectedRoute>
                <AppLayout><Search /></AppLayout>
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