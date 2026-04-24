import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { LogOut, Loader2 } from 'lucide-react'
import Sidebar, { MobileMenuButton } from './Sidebar'
import PageTransition from './PageTransition'
import Modal from '../common/Modal'
import { logoutThunk } from '../../features/auth/authThunks'

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await dispatch(logoutThunk()).unwrap()
    } catch {
      // ignore — authThunk already swallows error, local state is cleared
    } finally {
      setIsLoggingOut(false)
      setShowLogoutModal(false)
      navigate('/login')
    }
  }

  return (
    <div className="flex min-h-screen bg-sidebar">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <MobileMenuButton onClick={() => setSidebarOpen(true)} />

      {/* Top-right logout button */}
      <button
        onClick={() => setShowLogoutModal(true)}
        className="fixed top-3 right-3 sm:top-4 sm:right-4 z-30 flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-white text-darkest hover:bg-red-50 hover:text-red-600 shadow-md border border-cardLight/20 transition-colors"
        title="Logout"
      >
        <LogOut size={18} />
        <span className="hidden sm:inline text-sm font-medium">Logout</span>
      </button>

      <main className="flex-1 lg:ml-[260px] bg-main min-h-screen p-4 pt-16 sm:p-6 sm:pt-16 lg:p-8 lg:pt-8">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>

      <Modal
        isOpen={showLogoutModal}
        onClose={() => !isLoggingOut && setShowLogoutModal(false)}
        title="Konfirmasi Logout"
        maxWidth="max-w-sm"
      >
        <p className="text-sm text-darkest/70 mb-6">
          Apakah Anda yakin ingin keluar dari akun ini?
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            disabled={isLoggingOut}
            onClick={() => setShowLogoutModal(false)}
            className="flex-1 py-2.5 rounded-xl bg-gray-100 text-darkest/50 hover:bg-gray-200 transition-colors font-medium disabled:opacity-60"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={isLoggingOut}
            onClick={handleLogout}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isLoggingOut && <Loader2 size={16} className="animate-spin" />}
            {isLoggingOut ? 'Keluar...' : 'Logout'}
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default MainLayout
