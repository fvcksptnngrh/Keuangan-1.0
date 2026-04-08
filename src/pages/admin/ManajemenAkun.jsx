import { useState } from 'react'
import { users as initialUsers } from '../../utils/mockData'
import Table from '../../components/common/Table'
import Modal from '../../components/common/Modal'
import { Plus, Pencil, Trash2 } from 'lucide-react'

const ManajemenAkun = () => {
  const [userList, setUserList] = useState(
    initialUsers.map(({ password, ...u }) => u)
  )
  const [showFormModal, setShowFormModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [formData, setFormData] = useState({
    nama: '',
    username: '',
    password: '',
    role: 'staff',
  })

  const openAdd = () => {
    setEditTarget(null)
    setFormData({ nama: '', username: '', password: '', role: 'staff' })
    setShowFormModal(true)
  }

  const openEdit = (user) => {
    setEditTarget(user)
    setFormData({ nama: user.nama, username: user.username, password: '', role: user.role })
    setShowFormModal(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editTarget) {
      setUserList((prev) =>
        prev.map((u) =>
          u.id === editTarget.id
            ? { ...u, nama: formData.nama, username: formData.username, role: formData.role }
            : u
        )
      )
    } else {
      setUserList((prev) => [
        ...prev,
        {
          id: Date.now(),
          nama: formData.nama,
          username: formData.username,
          role: formData.role,
          nip: '-',
        },
      ])
    }
    setShowFormModal(false)
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    setUserList((prev) => prev.filter((u) => u.id !== deleteTarget.id))
    setShowDeleteModal(false)
    setDeleteTarget(null)
  }

  const columns = [
    { key: 'no', label: 'No', render: (_, i) => i + 1 },
    { key: 'nama', label: 'Nama', sortable: true },
    { key: 'username', label: 'Username', sortable: true },
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
    {
      key: 'aksi',
      label: 'Aksi',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              openEdit(row)
            }}
            className="p-1.5 rounded-lg hover:bg-accent/30 text-cardMid transition-colors"
            title="Edit"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setDeleteTarget(row)
              setShowDeleteModal(true)
            }}
            className="p-1.5 rounded-lg hover:bg-red-100 text-red-500 transition-colors"
            title="Hapus"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold text-darkest">Manajemen Akun</h1>
      <p className="text-sm text-cardLight mt-1 mb-6">Kelola akun pengguna sistem</p>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-darkest">Daftar User</h2>
          <button
            onClick={openAdd}
            className="flex items-center gap-1.5 px-4 py-2 bg-sidebar hover:bg-darkest rounded-full text-white text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            Tambah Akun
          </button>
        </div>
        <Table columns={columns} data={userList} />
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        title={editTarget ? 'Edit Akun' : 'Tambah Akun'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-darkest/70 mb-1">Nama</label>
            <input
              type="text"
              required
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-cardLight/30 rounded-xl text-darkest text-sm focus:outline-none focus:border-cardMid"
            />
          </div>
          <div>
            <label className="block text-sm text-darkest/70 mb-1">Username</label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-cardLight/30 rounded-xl text-darkest text-sm focus:outline-none focus:border-cardMid"
            />
          </div>
          <div>
            <label className="block text-sm text-darkest/70 mb-1">
              Password {editTarget && '(kosongkan jika tidak diubah)'}
            </label>
            <input
              type="password"
              required={!editTarget}
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
              className="flex-1 py-2.5 rounded-xl bg-sidebar hover:bg-darkest text-white font-bold transition-colors"
            >
              {editTarget ? 'Simpan' : 'Tambah'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setDeleteTarget(null)
        }}
        title="Konfirmasi Hapus"
        maxWidth="max-w-sm"
      >
        <p className="text-sm text-darkest/70 mb-6">
          Apakah Anda yakin ingin menghapus akun{' '}
          <span className="text-darkest font-medium">"{deleteTarget?.nama}"</span>?
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setShowDeleteModal(false)
              setDeleteTarget(null)
            }}
            className="flex-1 py-2.5 rounded-xl bg-gray-100 text-darkest/50 hover:bg-gray-200 transition-colors font-medium"
          >
            Batal
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-colors"
          >
            Hapus
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default ManajemenAkun
