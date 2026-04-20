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
    <div className="flex min-h-[calc(100svh-5rem)] items-center justify-center py-4 sm:min-h-[calc(100svh-6rem)] sm:py-6 lg:min-h-[calc(100svh-4rem)] lg:py-8">
      <div className="w-full max-w-xl">
        <div className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-black/5 sm:p-8">
          <div className="mb-6 text-center sm:mb-8">
            <h1 className="text-2xl font-bold text-darkest sm:text-3xl">Ubah Password</h1>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-cardLight">
              Perbarui password akun Anda secara berkala untuk keamanan.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label className="mb-1.5 block text-sm text-darkest/70">Password Lama</label>
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
              <label className="mb-1.5 block text-sm text-darkest/70">Password Baru</label>
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
              <label className="mb-1.5 block text-sm text-darkest/70">Konfirmasi Password Baru</label>
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
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-500">{error}</p>
            )}
            {success && (
              <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-600">
                <CheckCircle2 size={16} className="shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-sidebar py-3 font-bold text-white transition-colors hover:bg-darkest disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading && <Loader2 size={18} className="animate-spin" />}
              {isLoading ? 'Memproses...' : 'Ubah Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UbahPassword
