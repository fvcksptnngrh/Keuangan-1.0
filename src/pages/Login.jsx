import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { BadgeCheck, Lock, Eye, EyeOff, Loader2, Mail } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { loginThunk, forgotPasswordThunk } from '../features/auth/authThunks'
import { clearError } from '../features/auth/authSlice'

const Login = () => {
  const [mode, setMode] = useState('login')
  const [nip, setNip] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [validationError, setValidationError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, isLoading, error } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const isForgot = mode === 'forgot'

  const resetMessages = () => {
    setValidationError('')
    setSuccessMessage('')
    dispatch(clearError())
  }

  const switchMode = (next) => {
    setMode(next)
    resetMessages()
    setPassword('')
    setEmail('')
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    resetMessages()

    if (!nip.trim() || !password.trim()) {
      setValidationError('NIP dan password tidak boleh kosong')
      return
    }

    const result = await dispatch(loginThunk({ nip, password }))
    if (loginThunk.fulfilled.match(result)) {
      navigate('/dashboard')
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    resetMessages()

    if (!email.trim()) {
      setValidationError('Email tidak boleh kosong')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setValidationError('Format email tidak valid')
      return
    }

    const result = await dispatch(forgotPasswordThunk({ email }))
    if (forgotPasswordThunk.fulfilled.match(result)) {
      setSuccessMessage(
        result.payload.message ||
          'Link reset password telah dikirim ke email Anda. Silakan cek inbox.'
      )
      setEmail('')
    } else {
      setValidationError(result.payload || 'Gagal mengirim link reset password')
    }
  }

  const title = isForgot ? 'Lupa Password' : 'Masuk ke Akun Anda'
  const subtitle = isForgot
    ? 'Masukkan email untuk menerima link reset password'
    : 'Silakan masukkan kredensial Anda'
  const submitLabel = isLoading
    ? 'Memproses...'
    : isForgot
      ? 'Kirim Link Reset'
      : 'Login'

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <div className="w-full max-w-[460px]">
        <div className="flex justify-center mb-4">
          <img src="/logo-login.png" alt="Logo" className="h-29 object-contain" />
        </div>

        <div
          className="rounded-2xl px-8 sm:px-10 py-10 shadow-xl flex flex-col"
          style={{ backgroundColor: '#00325A' }}
        >
          <h2 className="text-2xl font-bold text-white text-center mb-2">{title}</h2>
          <p className="text-center text-white/60 text-sm mb-8">{subtitle}</p>

          <form
            onSubmit={isForgot ? handleForgotPassword : handleLogin}
            className="space-y-4"
          >
            {isForgot ? (
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-cardLight"
                />
                <input
                  type="email"
                  placeholder="Email terdaftar"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/15 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:border-accent/50 transition-colors"
                />
              </div>
            ) : (
              <>
                <div className="relative">
                  <BadgeCheck
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-cardLight"
                  />
                  <input
                    type="text"
                    placeholder="NIP"
                    autoComplete="username"
                    value={nip}
                    onChange={(e) => setNip(e.target.value)}
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
                    autoComplete="current-password"
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
              </>
            )}

            {(validationError || error) && (
              <p className="text-red-400 text-sm text-center">
                {validationError || error}
              </p>
            )}
            {successMessage && (
              <p className="text-green-400 text-sm text-center">{successMessage}</p>
            )}

            {!isForgot && (
              <div className="flex justify-end -mt-2">
                <button
                  type="button"
                  onClick={() => switchMode('forgot')}
                  className="text-accent text-sm hover:underline"
                >
                  Lupa password?
                </button>
              </div>
            )}

            <div className="pt-2" />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-cardMid hover:bg-cardLight text-white font-bold rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 size={18} className="animate-spin" />}
              {submitLabel}
            </button>

            {isForgot && (
              <p className="text-center text-sm text-white/60">
                Ingat password Anda?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-accent font-semibold hover:underline"
                >
                  Kembali ke Login
                </button>
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
