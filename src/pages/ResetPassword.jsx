import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Navigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { resetPasswordThunk } from '../features/auth/authThunks'

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated } = useAuth()

  const token = searchParams.get('token') || ''

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (success) {
      const t = setTimeout(() => navigate('/login'), 2500)
      return () => clearTimeout(t)
    }
  }, [success, navigate])

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!token) {
      setError('Token reset tidak ditemukan di URL')
      return
    }
    if (!newPassword || !confirmPassword) {
      setError('Semua field wajib diisi')
      return
    }
    if (newPassword.length < 6) {
      setError('Password minimal 6 karakter')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Konfirmasi password tidak cocok')
      return
    }

    setIsLoading(true)
    const result = await dispatch(
      resetPasswordThunk({
        token,
        newPassword,
        confirmNewPassword: confirmPassword,
      })
    )
    setIsLoading(false)

    if (resetPasswordThunk.fulfilled.match(result)) {
      setSuccess(
        result.payload.message ||
          'Password berhasil direset. Anda akan diarahkan ke halaman login...'
      )
      setNewPassword('')
      setConfirmPassword('')
    } else {
      setError(result.payload || 'Gagal mereset password')
    }
  }

  const inputClass =
    'w-full pl-10 pr-10 py-3 bg-white/10 border border-white/15 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:border-accent/50 transition-colors'

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <div className="w-full max-w-[460px]">
        <div className="flex justify-center mb-6">
          <img src="/logo-login.png" alt="Logo" className="h-32 object-contain" />
        </div>

        <div
          className="rounded-2xl px-8 sm:px-10 py-10 shadow-xl flex flex-col"
          style={{ backgroundColor: '#00325A' }}
        >
          <h2 className="text-2xl font-bold text-white text-center mb-2">
            Reset Password
          </h2>
          <p className="text-center text-white/60 text-sm mb-8">
            Masukkan password baru untuk akun Anda
          </p>

          {!token ? (
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertTriangle size={22} className="text-red-400" />
              </div>
              <p className="text-red-300 text-sm">
                Token reset tidak ditemukan. Silakan gunakan link yang dikirim ke email Anda.
              </p>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="mt-4 text-accent text-sm font-semibold hover:underline"
              >
                Kembali ke Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-cardLight"
                />
                <input
                  type={showNew ? 'text' : 'password'}
                  placeholder="Password Baru"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                >
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-cardLight"
                />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Konfirmasi Password Baru"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}
              {success && (
                <div className="flex items-center justify-center gap-2 text-green-400 text-sm">
                  <CheckCircle2 size={16} />
                  <span>{success}</span>
                </div>
              )}

              <div className="pt-2" />

              <button
                type="submit"
                disabled={isLoading || !!success}
                className="w-full py-3 bg-cardMid hover:bg-cardLight text-white font-bold rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading && <Loader2 size={18} className="animate-spin" />}
                {isLoading ? 'Memproses...' : success ? 'Berhasil' : 'Reset Password'}
              </button>

              <p className="text-center text-sm text-white/60">
                Ingat password Anda?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-accent font-semibold hover:underline"
                >
                  Kembali ke Login
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
