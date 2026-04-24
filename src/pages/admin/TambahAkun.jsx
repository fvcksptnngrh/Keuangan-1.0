import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { registerApi } from '../../api/authApi'

const TambahAkun = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    nip: '',
    email: '',
    password: '',
    role: 'staff',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    setIsSubmitting(true)

    try {
      await registerApi(formData)
      navigate('/admin/akun')
    } catch (error) {
      setSubmitError(error.response?.data?.message || 'Gagal menambah akun')
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateField = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/admin/akun')}
          className="p-2 rounded-xl bg-white hover:bg-gray-100 border border-cardLight/20 transition-colors"
          title="Kembali"
        >
          <ArrowLeft size={18} className="text-darkest" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-darkest">Tambah Akun</h1>
          <p className="text-sm text-cardLight mt-1">Daftarkan pengguna baru ke sistem</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-darkest/70 mb-1">Nama</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={updateField('name')}
              className="w-full px-3 py-2.5 bg-white border border-cardLight/30 rounded-xl text-darkest text-sm focus:outline-none focus:border-cardMid"
            />
          </div>
          <div>
            <label className="block text-sm text-darkest/70 mb-1">NIP</label>
            <input
              type="text"
              required
              value={formData.nip}
              onChange={updateField('nip')}
              className="w-full px-3 py-2.5 bg-white border border-cardLight/30 rounded-xl text-darkest text-sm focus:outline-none focus:border-cardMid"
            />
          </div>
          <div>
            <label className="block text-sm text-darkest/70 mb-1">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={updateField('email')}
              className="w-full px-3 py-2.5 bg-white border border-cardLight/30 rounded-xl text-darkest text-sm focus:outline-none focus:border-cardMid"
            />
          </div>
          <div>
            <label className="block text-sm text-darkest/70 mb-1">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={formData.password}
              onChange={updateField('password')}
              className="w-full px-3 py-2.5 bg-white border border-cardLight/30 rounded-xl text-darkest text-sm focus:outline-none focus:border-cardMid"
            />
          </div>
          <div>
            <label className="block text-sm text-darkest/70 mb-1">Role</label>
            <select
              value={formData.role}
              onChange={updateField('role')}
              className="w-full px-3 py-2.5 bg-white border border-cardLight/30 rounded-xl text-darkest text-sm focus:outline-none focus:border-cardMid"
            >
              <option value="admin">Admin</option>
              <option value="management">Management</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          {submitError && (
            <p className="text-red-500 text-sm text-center bg-red-50 border border-red-100 rounded-lg py-2 px-3">
              {submitError}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/admin/akun')}
              className="flex-1 py-2.5 rounded-xl bg-gray-100 text-darkest/50 hover:bg-gray-200 transition-colors font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl bg-sidebar hover:bg-darkest text-white font-bold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              {isSubmitting ? 'Memproses...' : 'Tambah Akun'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TambahAkun
