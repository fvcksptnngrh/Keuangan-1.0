import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import ProtectedRoute from '../components/layout/ProtectedRoute'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import ArsipKepegawaian from '../pages/arsip/ArsipKepegawaian'
import ArsipKeuangan from '../pages/arsip/ArsipKeuangan'
import ArsipUmum from '../pages/arsip/ArsipUmum'
import KatalogBarang from '../pages/katalog/KatalogBarang'
import ManajemenAkun from '../pages/admin/ManajemenAkun'
import ManajemenInventaris from '../pages/admin/ManajemenInventaris'
import NotFound from '../pages/errors/NotFound'
import ServerError from '../pages/errors/ServerError'
import Forbidden from '../pages/errors/Forbidden'

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
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

          {/* Arsip */}
          <Route path="/arsip/kepegawaian" element={<ArsipKepegawaian />} />
          <Route path="/arsip/keuangan" element={<ArsipKeuangan />} />
          <Route path="/arsip/umum" element={<ArsipUmum />} />

          {/* Inventaris */}
          <Route path="/inventaris/katalog" element={<KatalogBarang />} />

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
            path="/admin/inventaris"
            element={
              <ProtectedRoute feature="admin">
                <ManajemenInventaris />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
