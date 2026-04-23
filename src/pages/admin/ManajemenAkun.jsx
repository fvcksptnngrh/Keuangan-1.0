import { useEffect, useState } from 'react'
import { getUsersApi, registerApi } from '../../api/authApi'
import Table from '../../components/common/Table'
import Modal from '../../components/common/Modal'
import { Plus, Loader2 } from 'lucide-react'

const ManajemenAkun = () => {
  const [userList, setUserList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showFormModal, setShowFormModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    nip: '',
    email: '',
    password: '',
    role: 'staff',
  })

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const response = await getUsersApi()
      const users = (response.data.data || []).map((u) => ({
        id: u.id ?? u.ID,
        nama: u.name ?? u.Name,
        nip: u.nip ?? u.NIP,
        email: u.email ?? u.Email,
        role: u.role ?? u.Role,
      }))
      setUserList(users)
    } catch {
      setUserList([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const openAdd = () => {
    setFormData({ name: '', nip: '', email: '', password: '', role: 'staff' })
    setSubmitError('')
    setShowFormModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    setIsSubmitting(true)

    try {
      // POST /api/register { nip, name, email, password, role }
      await registerApi({
        nip: formData.nip,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      })
      setShowFormModal(false)
      fetchUsers() // Refresh list
    } catch (error) {
      setSubmitError(error.response?.data?.message || 'Gagal menambah akun')
    } finally {
      setIsSubmitting(false)
    }
  }

  const columns = [
    { key: 'no', label: 'No', render: (_, i) => i + 1 },
    { key: 'nama', label: 'Nama', sortable: true },
    { key: 'nip', label: 'NIP', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (row) => (
        <span className="capitalize px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent text-darkest">
          {row.role}
        </span>
      ),
    },
  ]

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-darkest">Manajemen Akun</h1>
      <p className="text-sm text-cardLight mt-1 mb-6">Kelola akun pengguna sistem</p>

      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-lg font-bold text-darkest">Daftar User</h2>
          <button
            onClick={openAdd}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-sidebar hover:bg-darkest rounded-full text-white text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            Tambah Akun
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-cardMid border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <Table columns={columns} data={userList} />
        )}
      </div>

      {/* Tambah Akun Modal */}
      <Modal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        title="Tambah Akun"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-darkest/70 mb-1">Nama</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-cardLight/30 rounded-xl text-darkest text-sm focus:outline-none focus:border-cardMid"
            />
          </div>
          <div>
            <label className="block text-sm text-darkest/70 mb-1">NIP</label>
            <input
              type="text"
              required
              value={formData.nip}
              onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-cardLight/30 rounded-xl text-darkest text-sm focus:outline-none focus:border-cardMid"
            />
          </div>
          <div>
            <label className="block text-sm text-darkest/70 mb-1">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-cardLight/30 rounded-xl text-darkest text-sm focus:outline-none focus:border-cardMid"
            />
          </div>
          <div>
            <label className="block text-sm text-darkest/70 mb-1">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-cardLight/30 rounded-xl text-darkest text-sm focus:outline-none focus:border-cardMid"
            />
          </div>
          <div>
            <label className="block text-sm text-darkest/70 mb-1">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-cardLight/30 rounded-xl text-darkest text-sm focus:outline-none focus:border-cardMid"
            >
              <option value="admin">Admin</option>
              <option value="management">Management</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          {submitError && (
            <p className="text-red-500 text-sm text-center">{submitError}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowFormModal(false)}
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
              {isSubmitting ? 'Memproses...' : 'Tambah'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default ManajemenAkun
