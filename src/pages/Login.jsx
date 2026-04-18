import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { BadgeCheck, Lock, Eye, EyeOff, Loader2, UserPlus, Mail } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { loginThunk, registerThunk, forgotPasswordThunk } from '../features/auth/authThunks'
import { clearError } from '../features/auth/authSlice'

const Login = () => {
  const [mode, setMode] = useState('login')
  const [nip, setNip] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [validationError, setValidationError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Register fields
  const [nama, setNama] = useState('')
  const [email, setEmail] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, isLoading, error } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const resetFields = () => {
    setValidationError('')
    setSuccessMessage('')
    dispatch(clearError())
  }

  const switchMode = (next) => {
    setMode(next)
    resetFields()
    setPassword('')
    setConfirmPassword('')
    setEmail('')
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    resetFields()

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

  const handleLogin = async (e) => {
    e.preventDefault()
    resetFields()

    if (!nip.trim() || !password.trim()) {
      setValidationError('NIP dan password tidak boleh kosong')
      return
    }

    const result = await dispatch(loginThunk({ nip, password }))
    if (loginThunk.fulfilled.match(result)) {
      navigate('/dashboard')
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    resetFields()

    if (!nama.trim() || !nip.trim() || !email.trim() || !password.trim()) {
      setValidationError('Semua field wajib diisi')
      return
    }
    if (password.length < 6) {
      setValidationError('Password minimal 6 karakter')
      return
    }
    if (password !== confirmPassword) {
      setValidationError('Konfirmasi password tidak cocok')
      return
    }

    const result = await dispatch(
      registerThunk({
        nip,
        name: nama,
        email,
        password,
        role: 'staff',
      })
    )

    if (registerThunk.fulfilled.match(result)) {
      setSuccessMessage('Pendaftaran berhasil! Silakan login.')
      setTimeout(() => {
        setMode('login')
        setPassword('')
        setConfirmPassword('')
        setNama('')
        setEmail('')
        setSuccessMessage('')
      }, 1500)
    }
  }

  const isRegister = mode === 'register'
  const isForgot = mode === 'forgot'

  const getTitle = () => {
    if (isRegister) return 'Buat Akun Baru'
    if (isForgot) return 'Lupa Password'
    return 'Masuk ke Akun Anda'
  }
  const getSubtitle = () => {
    if (isRegister) return 'Isi data diri untuk mendaftar'
    if (isForgot) return 'Masukkan email untuk menerima link reset password'
    return 'Silakan masukkan kredensial Anda'
  }
  const getSubmitHandler = () => {
    if (isRegister) return handleRegister
    if (isForgot) return handleForgotPassword
    return handleLogin
  }
  const getSubmitLabel = () => {
    if (isLoading) return 'Memproses...'
    if (isRegister) return 'Daftar'
    if (isForgot) return 'Kirim Link Reset'
    return 'Login'
  }

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
            {getTitle()}
          </h2>
          <p className="text-center text-white/60 text-sm mb-8">
            {getSubtitle()}
          </p>

          <form onSubmit={getSubmitHandler()} className="space-y-4">
            {isForgot && (
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
            )}

            {isRegister && (
              <div className="relative">
                <UserPlus
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-cardLight"
                />
                <input
                  type="text"
                  placeholder="Nama Lengkap"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/15 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:border-accent/50 transition-colors"
                />
              </div>
            )}

            {!isForgot && (
              <div className="relative">
                <BadgeCheck
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-cardLight"
                />
                <input
                  type="text"
                  placeholder="NIP"
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/15 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:border-accent/50 transition-colors"
                />
              </div>
            )}

            {isRegister && (
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-cardLight"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/15 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:border-accent/50 transition-colors"
                />
              </div>
            )}

            {!isForgot && (
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
            )}

            {isRegister && (
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-cardLight"
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Konfirmasi Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/15 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:border-accent/50 transition-colors"
                />
              </div>
            )}

            {(validationError || error) && (
              <p className="text-red-400 text-sm text-center">
                {validationError || error}
              </p>
            )}
            {successMessage && (
              <p className="text-green-400 text-sm text-center">{successMessage}</p>
            )}

            {mode === 'login' && (
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
              {getSubmitLabel()}
            </button>

            {isForgot ? (
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
            ) : (
              <p className="text-center text-sm text-white/60">
                {isRegister ? 'Sudah punya akun?' : 'Belum punya akun?'}{' '}
                <button
                  type="button"
                  onClick={() => switchMode(isRegister ? 'login' : 'register')}
                  className="text-accent font-semibold hover:underline"
                >
                  {isRegister ? 'Login' : 'Daftar'}
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
