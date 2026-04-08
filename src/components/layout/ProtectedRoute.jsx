import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { canAccess } from '../../utils/roleGuard'

const ProtectedRoute = ({ children, feature }) => {
  const { isAuthenticated, isLoading, role } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-main">
        <div className="w-10 h-10 border-4 border-cardMid border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (feature && !canAccess(role, feature)) {
    return <Navigate to="/403" replace />
  }

  return children
}

export default ProtectedRoute
