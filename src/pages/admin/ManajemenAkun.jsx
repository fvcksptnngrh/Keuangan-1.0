import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUsersApi } from '../../api/authApi'
import Table from '../../components/common/Table'
import { Plus } from 'lucide-react'

const ManajemenAkun = () => {
  const navigate = useNavigate()
  const [userList, setUserList] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
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
    fetchUsers()
  }, [])

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
            onClick={() => navigate('/admin/akun/tambah')}
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
    </div>
  )
}

export default ManajemenAkun
