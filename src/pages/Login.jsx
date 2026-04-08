import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { User, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { loginThunk } from '../features/auth/authThunks'
import { clearError } from '../features/auth/authSlice'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [validationError, setValidationError] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, isLoading, error } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setValidationError('')
    dispatch(clearError())

    if (!username.trim() || !password.trim()) {
      setValidationError('Username dan password tidak boleh kosong')
      return
    }

    const result = await dispatch(loginThunk({ username, password }))
    if (loginThunk.fulfilled.match(result)) {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <div className="w-full max-w-[420px]">
        <div className="flex justify-center mb-8">
          <img src="/logo-login.png" alt="Logo" className="h-35 object-contain" />
        </div>

        <div className="rounded-2xl p-10 shadow-xl" style={{ backgroundColor: '#00325A' }}>
          <h2 className="text-xl font-bold text-white text-center mb-6">
            Masuk ke Akun Anda
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-cardLight"
              />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/15 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:border-accent/50 transition-colors"
              />
            </div>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-cardLight"
              />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-white/10 border border-white/15 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:border-accent/50 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {(validationError || error) && (
              <p className="text-red-400 text-sm text-center">
                {validationError || error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-cardMid hover:bg-cardLight text-white font-bold rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 size={18} className="animate-spin" />}
              {isLoading ? 'Memproses...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 p-3 bg-white/5 rounded-xl">
            <p className="text-xs text-white/60 text-center mb-2">
              Demo Credentials:
            </p>
            <div className="text-xs text-white/50 space-y-0.5">
              <p>
                <span className="text-accent">admin</span> / admin123 (Admin)
              </p>
              <p>
                <span className="text-accent">management</span> / mgmt123
                (Management)
              </p>
              <p>
                <span className="text-accent">staff</span> / staff123 (Staff)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
