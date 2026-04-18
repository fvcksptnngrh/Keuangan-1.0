import { useState, useEffect, useRef } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {
  Home,
  FolderOpen,
  Users,
  LogOut,
  ChevronRight,
  ClipboardList,
  KeyRound,
  Menu,
  X,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { canAccess } from '../../utils/roleGuard'
import { logoutThunk } from '../../features/auth/authThunks'
import Avatar from '../common/Avatar'

const menuItems = [
  { label: 'Dashboard', icon: Home, path: '/dashboard', feature: 'dashboard' },
  {
    label: 'Arsip Dokumen',
    icon: FolderOpen,
    feature: 'arsip',
    key: 'arsip',
    children: [
      { label: 'Kepegawaian', path: '/arsip/kepegawaian' },
      { label: 'Keuangan', path: '/arsip/keuangan' },
      { label: 'Umum', path: '/arsip/umum' },
    ],
  },
  { label: 'Manajemen Akun', icon: Users, path: '/admin/akun', feature: 'admin' },
  {
    label: 'Log Aktivitas',
    icon: ClipboardList,
    path: '/admin/log',
    feature: 'log',
  },
  { label: 'Ubah Password', icon: KeyRound, path: '/akun/ubah-password', feature: 'dashboard' },
]

const getInitialOpenMenu = (pathname) => {
  for (const item of menuItems) {
    if (item.children?.some((child) => pathname.startsWith(child.path))) {
      return item.key
    }
  }
  return null
}

const AccordionChildren = ({ isExpanded, children }) => {
  const [overflow, setOverflow] = useState(isExpanded ? 'visible' : 'hidden')
  const ref = useRef(null)

  useEffect(() => {
    if (!isExpanded) {
      setOverflow('hidden')
    }
  }, [isExpanded])

  const handleTransitionEnd = () => {
    if (isExpanded) {
      setOverflow('visible')
    }
  }

  return (
    <div
      ref={ref}
      onTransitionEnd={handleTransitionEnd}
      style={{
        maxHeight: isExpanded ? '200px' : '0px',
        overflow,
        transition: 'max-height 300ms ease',
      }}
    >
      {children}
    </div>
  )
}

const Sidebar = ({ isOpen, onClose }) => {
  const { user, role } = useAuth()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [openMenu, setOpenMenu] = useState(() => getInitialOpenMenu(location.pathname))

  useEffect(() => {
    const active = getInitialOpenMenu(location.pathname)
    if (active) setOpenMenu(active)
  }, [location.pathname])

  // Close sidebar on route change (mobile)
  useEffect(() => {
    onClose?.()
  }, [location.pathname])

  const toggleMenu = (key) => {
    setOpenMenu((prev) => (prev === key ? null : key))
  }

  const handleLogout = () => {
    dispatch(logoutThunk()).then(() => navigate('/login'))
  }

  const visibleMenus = menuItems.filter((item) => {
    if (item.feature && !canAccess(role, item.feature)) return false
    return true
  })

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen w-[260px] flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: 'linear-gradient(180deg, #00325A 0%, #2E5575 100%)' }}
      >
        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 lg:hidden"
        >
          <X size={20} />
        </button>

        {/* User Info */}
        <div className="flex flex-col items-center pt-8 pb-4 px-6">
          <Avatar size={80} nama={user?.nama} borderColor="#7DA0CA" />
          <h3 className="mt-3 font-bold text-white text-base">
            {user?.nama || 'User'}
          </h3>
          <p className="text-cardLight text-xs mt-0.5">
            NIP: {user?.nip || '-'}
          </p>
        </div>

        <div className="mx-6 border-t border-white/15" />

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto overflow-x-visible pl-4 pr-0 py-4 space-y-1">
          {visibleMenus.map((item) => {
            const Icon = item.icon
            const hasChildren = item.children?.length > 0
            const isExpanded = openMenu === item.key

            if (hasChildren) {
              return (
                <div key={item.label}>
                  <button
                    onClick={() => toggleMenu(item.key)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 mr-4 rounded-xl transition-colors ${
                      isExpanded
                        ? 'bg-white/10 text-white font-bold'
                        : 'text-white/80 hover:bg-white/10'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="flex-1 text-left text-sm font-medium">
                      {item.label}
                    </span>
                    <ChevronRight
                      size={16}
                      className="transition-transform duration-200"
                      style={{
                        transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                      }}
                    />
                  </button>
                  <AccordionChildren isExpanded={isExpanded}>
                    {item.children.map((child) => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        className={({ isActive }) =>
                          isActive
                            ? 'sidebar-tab-active block pl-12 pr-4 py-2.5 text-sm text-darkest font-bold relative'
                            : 'block pl-12 pr-4 py-2 mr-4 rounded-xl text-sm text-white/60 hover:bg-white/10 hover:text-white transition-colors'
                        }
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </AccordionChildren>
                </div>
              )
            }

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? 'sidebar-tab-active flex items-center gap-3 px-4 py-3 text-darkest font-bold relative'
                    : 'flex items-center gap-3 px-4 py-2.5 mr-4 rounded-xl text-white/80 hover:bg-white/10 transition-colors'
                }
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="pl-4 pr-4 pb-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}

// Mobile hamburger button component
export const MobileMenuButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="fixed top-4 left-4 z-30 p-2.5 rounded-xl bg-sidebar text-white shadow-lg lg:hidden"
  >
    <Menu size={22} />
  </button>
)

export default Sidebar
