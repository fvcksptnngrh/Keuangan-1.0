import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import MainLayout from '../components/layout/MainLayout'
import ProtectedRoute from '../components/layout/ProtectedRoute'
import { useAuth } from '../hooks/useAuth'
import { getMeThunk } from '../features/auth/authThunks'
import Login from '../pages/Login'
import ResetPassword from '../pages/ResetPassword'
import Dashboard from '../pages/Dashboard'
import ArsipKepegawaian from '../pages/arsip/ArsipKepegawaian'
import ArsipKeuangan from '../pages/arsip/ArsipKeuangan'
import ArsipUmum from '../pages/arsip/ArsipUmum'
import ManajemenAkun from '../pages/admin/ManajemenAkun'
import LogAktivitas from '../pages/admin/LogAktivitas'
import UbahPassword from '../pages/akun/UbahPassword'
import NotFound from '../pages/errors/NotFound'
import ServerError from '../pages/errors/ServerError'
import Forbidden from '../pages/errors/Forbidden'

const RootRedirect = () => {
  const { isAuthenticated, isLoading } = useAuth()
  const dispatch = useDispatch()

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      dispatch(getMeThunk())
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-main">
        <div className="w-10 h-10 border-4 border-cardMid border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />
}

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/403" element={<Forbidden />} />
        <Route path="/500" element={<ServerError />} />

        <Route
          element={
            <ProtectedRoute feature="dashboard">
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/akun/ubah-password" element={<UbahPassword />} />

          {/* Arsip */}
          <Route path="/arsip/kepegawaian" element={<ArsipKepegawaian />} />
          <Route path="/arsip/keuangan" element={<ArsipKeuangan />} />
          <Route path="/arsip/umum" element={<ArsipUmum />} />

          {/* Admin */}
          <Route
            path="/admin/akun"
            element={
              <ProtectedRoute feature="admin">
                <ManajemenAkun />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/log"
            element={
              <ProtectedRoute feature="log">
                <LogAktivitas />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="/" element={<RootRedirect />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
