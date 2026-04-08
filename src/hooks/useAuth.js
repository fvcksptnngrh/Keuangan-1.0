import { useSelector } from 'react-redux'

export const useAuth = () => {
  const auth = useSelector((state) => state.auth)
  return {
    user: auth.user,
    token: auth.token,
    role: auth.role,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: auth.error,
    isAdmin: auth.role === 'admin',
    isManagement: auth.role === 'management',
    isStaff: auth.role === 'staff',
  }
}
