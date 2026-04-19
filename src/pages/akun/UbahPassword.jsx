import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Lock, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react'
import { changePasswordThunk } from '../../features/auth/authThunks'

const UbahPassword = () => {
  const dispatch = useDispatch()
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('Semua field wajib diisi')
      return
    }
    if (newPassword.length < 6) {
      setError('Password baru minimal 6 karakter')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Konfirmasi password baru tidak cocok')
      return
    }
    if (oldPassword === newPassword) {
      setError('Password baru tidak boleh sama dengan password lama')
      return
    }

    setIsLoading(true)
    const result = await dispatch(
      changePasswordThunk({
        oldPassword,
        newPassword,
        confirmPassword,
      })
    )
    setIsLoading(false)

    if (changePasswordThunk.fulfilled.match(result)) {
      setSuccess(result.payload.message || 'Password berhasil diubah')
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } else {
      setError(result.payload || 'Gagal mengubah password')
    }
  }

  const inputClass =
    'w-full pl-10 pr-10 py-3 bg-white border border-cardLight/30 rounded-xl text-darkest text-sm placeholder:text-cardLight focus:outline-none focus:border-sidebar focus:ring-1 focus:ring-sidebar/20 transition-colors'

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-darkest">Ubah Password</h1>
      <p className="text-sm text-cardLight mt-1 mb-6">
        Perbarui password akun Anda secara berkala untuk keamanan.
      </p>

      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-darkest/70 mb-1.5">Password Lama</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-cardLight" />
              <input
                type={showOld ? 'text' : 'password'}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Masukkan password lama"
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cardLight hover:text-darkest"
              >
                {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-darkest/70 mb-1.5">Password Baru</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-cardLight" />
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cardLight hover:text-darkest"
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-darkest/70 mb-1.5">Konfirmasi Password Baru</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-cardLight" />
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password baru"
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cardLight hover:text-darkest"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}
          {success && (
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 rounded-lg px-3 py-2">
              <CheckCircle2 size={16} />
              <span>{success}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-sidebar hover:bg-darkest text-white font-bold rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            {isLoading && <Loader2 size={18} className="animate-spin" />}
            {isLoading ? 'Memproses...' : 'Ubah Password'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default UbahPassword
