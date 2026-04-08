import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchInventarisThunk,
  createInventarisThunk,
  updateInventarisThunk,
  deleteInventarisThunk,
} from '../../features/inventaris/inventarisThunks'
import Table from '../../components/common/Table'
import Modal from '../../components/common/Modal'
import { Plus, Pencil, Trash2, Package } from 'lucide-react'

const ManajemenInventaris = () => {
  const dispatch = useDispatch()
  const { items, isLoading } = useSelector((state) => state.inventaris)

  const [showFormModal, setShowFormModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [formData, setFormData] = useState({
    nama: '',
    stok: 0,
    kategori: '',
    gambar: null,
  })

  useEffect(() => {
    dispatch(fetchInventarisThunk())
  }, [dispatch])

  const openAdd = () => {
    setEditTarget(null)
    setFormData({ nama: '', stok: 0, kategori: '', gambar: null })
    setShowFormModal(true)
  }

  const openEdit = (item) => {
    setEditTarget(item)
    setFormData({
      nama: item.nama,
      stok: item.stok,
      kategori: item.kategori || '',
      gambar: null,
    })
    setShowFormModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = {
      nama: formData.nama,
      stok: parseInt(formData.stok, 10),
      kategori: formData.kategori,
      gambar: null,
    }

    if (editTarget) {
      await dispatch(updateInventarisThunk({ id: editTarget.id, data }))
    } else {
      await dispatch(createInventarisThunk(data))
    }
    setShowFormModal(false)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await dispatch(deleteInventarisThunk(deleteTarget.id))
    setShowDeleteModal(false)
    setDeleteTarget(null)
  }

  const columns = [
    { key: 'no', label: 'No', render: (_, i) => i + 1 },
    {
      key: 'gambar',
      label: 'Gambar',
      render: (row) => (
        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
          {row.gambar ? (
            <img src={row.gambar} alt={row.nama} className="w-full h-full object-cover" />
          ) : (
            <Package size={18} className="text-cardLight/40" />
          )}
        </div>
      ),
    },
    { key: 'nama', label: 'Nama Barang', sortable: true },
    {
      key: 'stok',
      label: 'Stok',
      sortable: true,
      render: (row) => (
        <span className={row.stok === 0 ? 'text-red-500' : 'text-darkest'}>
          {row.stok}
        </span>
      ),
    },
    { key: 'kategori', label: 'Kategori', sortable: true },
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
      <h1 className="text-3xl font-bold text-darkest">Manajemen Inventaris</h1>
      <p className="text-sm text-cardLight mt-1 mb-6">Kelola data inventaris barang</p>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-darkest">Daftar Barang</h2>
          <button
            onClick={openAdd}
            className="flex items-center gap-1.5 px-4 py-2 bg-sidebar hover:bg-darkest rounded-full text-white text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            Tambah Barang
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-cardMid border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <Table columns={columns} data={items} />
        )}
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        title={editTarget ? 'Edit Barang' : 'Tambah Barang'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-darkest/70 mb-1">Nama Barang</label>
            <input
              type="text"
              required
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-cardLight/30 rounded-xl text-darkest text-sm focus:outline-none focus:border-cardMid"
            />
          </div>
          <div>
            <label className="block text-sm text-darkest/70 mb-1">Stok</label>
            <input
              type="number"
              required
              min="0"
              value={formData.stok}
              onChange={(e) => setFormData({ ...formData, stok: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-cardLight/30 rounded-xl text-darkest text-sm focus:outline-none focus:border-cardMid"
            />
          </div>
          <div>
            <label className="block text-sm text-darkest/70 mb-1">Kategori</label>
            <input
              type="text"
              value={formData.kategori}
              onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-cardLight/30 rounded-xl text-darkest text-sm focus:outline-none focus:border-cardMid"
              placeholder="Elektronik, Furnitur, dll."
            />
          </div>
          <div>
            <label className="block text-sm text-darkest/70 mb-1">Upload Gambar</label>
            <div className="border-2 border-dashed border-cardLight/40 rounded-xl p-4 text-center hover:border-cardMid transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData({ ...formData, gambar: e.target.files[0] })
                }
                className="w-full text-sm text-darkest file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:bg-sidebar file:text-white file:cursor-pointer"
              />
            </div>
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
          Apakah Anda yakin ingin menghapus{' '}
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

export default ManajemenInventaris
