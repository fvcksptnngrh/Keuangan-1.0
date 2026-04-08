import { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchArsipThunk, uploadArsipThunk, editArsipThunk, deleteArsipThunk, downloadArsipThunk } from '../../features/arsip/arsipThunks'
import { addLog } from '../../features/log/logSlice'
import { useAuth } from '../../hooks/useAuth'
import { canAccess } from '../../utils/roleGuard'
import Table from '../common/Table'
import Pagination from '../common/Pagination'
import SearchBar from '../common/SearchBar'
import Modal from '../common/Modal'
import { Plus, FileText, Download, Trash2, Eye, Pencil } from 'lucide-react'

const ArsipPage = ({ kategori, judul, subjudul }) => {
  const dispatch = useDispatch()
  const { user, role } = useAuth()
  const { dokumenByKategori, isLoading } = useSelector((state) => state.arsip)
  const dokumen = dokumenByKategori[kategori] || []

  const canCrud = canAccess(role, 'arsip.crud')
  const canDownload = canAccess(role, 'arsip.download')

  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [page, setPage] = useState(1)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [formData, setFormData] = useState({
    nama: '',
    noDokumen: '',
    tanggal: '',
    subBagian: '',
    file: null,
  })

  const ITEMS_PER_PAGE = 10

  useEffect(() => {
    dispatch(fetchArsipThunk(kategori))
  }, [dispatch, kategori])

  const filteredDokumen = useMemo(() => {
    return dokumen.filter((doc) => {
      const matchSearch =
        !search ||
        doc.nama.toLowerCase().includes(search.toLowerCase()) ||
        doc.noDokumen.toLowerCase().includes(search.toLowerCase())
      const matchDateFrom = !dateFrom || doc.tanggal >= dateFrom
      const matchDateTo = !dateTo || doc.tanggal <= dateTo
      return matchSearch && matchDateFrom && matchDateTo
    })
  }, [dokumen, search, dateFrom, dateTo])

  const totalPages = Math.ceil(filteredDokumen.length / ITEMS_PER_PAGE)
  const paginatedDokumen = filteredDokumen.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  )

  const handleUpload = async (e) => {
    e.preventDefault()
    const fd = new FormData()
    fd.append('nama', formData.nama)
    fd.append('noDokumen', formData.noDokumen)
    fd.append('tanggal', formData.tanggal)
    fd.append('subBagian', formData.subBagian)
    if (formData.file) fd.append('file', formData.file)

    await dispatch(uploadArsipThunk({ kategori, formData: fd }))
    dispatch(addLog({ userId: user.id, nama: user.nama, aksi: 'Mengunggah', target: formData.nama }))
    setShowUploadModal(false)
    setFormData({ nama: '', noDokumen: '', tanggal: '', subBagian: '', file: null })
  }

  const openEdit = (doc) => {
    setEditTarget(doc)
    setFormData({
      nama: doc.nama,
      noDokumen: doc.noDokumen,
      tanggal: doc.tanggal,
      subBagian: doc.subBagian,
      file: null,
    })
    setShowEditModal(true)
  }

  const handleEdit = async (e) => {
    e.preventDefault()
    await dispatch(editArsipThunk({
      id: editTarget.id,
      kategori,
      data: { nama: formData.nama, noDokumen: formData.noDokumen, tanggal: formData.tanggal, subBagian: formData.subBagian },
    }))
    setShowEditModal(false)
    setEditTarget(null)
    setFormData({ nama: '', noDokumen: '', tanggal: '', subBagian: '', file: null })
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await dispatch(deleteArsipThunk({ id: deleteTarget.id, kategori }))
    dispatch(addLog({ userId: user.id, nama: user.nama, aksi: 'Menghapus', target: deleteTarget.nama }))
    setShowDeleteModal(false)
    setDeleteTarget(null)
  }

  const handleDownload = (doc) => {
    dispatch(downloadArsipThunk({ id: doc.id, fileName: doc.file }))
    dispatch(addLog({ userId: user.id, nama: user.nama, aksi: 'Mengunduh', target: doc.nama }))
  }

  const columns = [
    {
      key: 'no',
      label: 'No',
      render: (_, index) => (page - 1) * ITEMS_PER_PAGE + index + 1,
    },
    { key: 'nama', label: 'Nama Dokumen', sortable: true },
    { key: 'noDokumen', label: 'No. Dokumen', sortable: true },
    { key: 'tanggal', label: 'Tgl. Dokumen', sortable: true },
    { key: 'subBagian', label: 'Sub Bagian', sortable: true },
    // Staff: no file column
    ...(canDownload
      ? [
          {
            key: 'file',
            label: 'File',
            render: (row) => (
              <div className="flex items-center gap-1.5">
                <FileText size={16} className="text-cardMid" />
                <span className="text-xs text-cardLight truncate max-w-[120px]">
                  {row.file}
                </span>
              </div>
            ),
          },
        ]
      : []),
    {
      key: 'aksi',
      label: 'Aksi',
      render: (row) => (
        <div className="flex items-center gap-1">
          {canDownload && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDownload(row)
                }}
                className="p-1.5 rounded-lg hover:bg-accent/30 text-cardMid transition-colors"
                title="Download"
              >
                <Download size={16} />
              </button>
              <button
                className="p-1.5 rounded-lg hover:bg-accent/30 text-cardMid transition-colors"
                title="Detail"
              >
                <Eye size={16} />
              </button>
            </>
          )}
          {canCrud && (
            <>
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
            </>
          )}
          {!canDownload && !canCrud && (
            <span className="text-xs text-cardLight italic">Hanya lihat</span>
          )}
        </div>
      ),
    },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold text-darkest">{judul}</h1>
      <p className="text-sm text-cardLight mt-1 mb-6">{subjudul}</p>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {canCrud && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-sidebar hover:bg-darkest rounded-full text-white text-sm font-medium transition-colors"
            >
              <Plus size={16} />
              Unggah
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-1.5 bg-white border border-cardLight/30 rounded-full text-xs text-darkest focus:outline-none focus:border-cardMid"
            />
            <span className="text-cardLight text-xs">-</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-1.5 bg-white border border-cardLight/30 rounded-full text-xs text-darkest focus:outline-none focus:border-cardMid"
            />
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Cari dokumen..."
              className="w-52"
            />
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-cardMid border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <Table columns={columns} data={paginatedDokumen} />
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Unggah Dokumen"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm text-darkest/70 mb-1">Nama Dokumen</label>
            <input type="text" required value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value })} className="w-full px-3 py-2 bg-white border border-cardLight/30 rounded-xl text-darkest text-sm focus:outline-none focus:border-cardMid" />
          </div>
          <div>
            <label className="block text-sm text-darkest/70 mb-1">No. Dokumen</label>
            <input type="text" required value={formData.noDokumen} onChange={(e) => setFormData({ ...formData, noDokumen: e.target.value })} className="w-full px-3 py-2 bg-white border border-cardLight/30 rounded-xl text-darkest text-sm focus:outline-none focus:border-cardMid" />
          </div>
          <div>
            <label className="block text-sm text-darkest/70 mb-1">Tgl. Dokumen</label>
            <input type="date" required value={formData.tanggal} onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })} className="w-full px-3 py-2 bg-white border border-cardLight/30 rounded-xl text-darkest text-sm focus:outline-none focus:border-cardMid" />
          </div>
          <div>
            <label className="block text-sm text-darkest/70 mb-1">Sub Bagian</label>
            <input type="text" required value={formData.subBagian} onChange={(e) => setFormData({ ...formData, subBagian: e.target.value })} className="w-full px-3 py-2 bg-white border border-cardLight/30 rounded-xl text-darkest text-sm focus:outline-none focus:border-cardMid" />
          </div>
          <div>
            <label className="block text-sm text-darkest/70 mb-1">Upload File</label>
            <div className="border-2 border-dashed border-cardLight/40 rounded-xl p-4 text-center hover:border-cardMid transition-colors">
              <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx" onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })} className="w-full text-sm text-darkest file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:bg-sidebar file:text-white file:cursor-pointer" />
              {formData.file && <p className="text-xs text-cardMid mt-2">{formData.file.name}</p>}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowUploadModal(false)} className="flex-1 py-2.5 rounded-xl bg-gray-100 text-darkest/50 hover:bg-gray-200 transition-colors font-medium">Batal</button>
            <button type="submit" className="flex-1 py-2.5 rounded-xl bg-sidebar hover:bg-darkest text-white font-bold transition-colors">Simpan</button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => { setShowEditModal(false); setEditTarget(null) }}
        title="Edit Dokumen"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleEdit} className="space-y-4">
          <div>
            <label className="block text-sm text-darkest/70 mb-1">Nama Dokumen</label>
            <input type="text" required value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value })} className="w-full px-3 py-2 bg-white border border-cardLight/30 rounded-xl text-darkest text-sm focus:outline-none focus:border-cardMid" />
          </div>
          <div>
            <label className="block text-sm text-darkest/70 mb-1">No. Dokumen</label>
            <input type="text" required value={formData.noDokumen} onChange={(e) => setFormData({ ...formData, noDokumen: e.target.value })} className="w-full px-3 py-2 bg-white border border-cardLight/30 rounded-xl text-darkest text-sm focus:outline-none focus:border-cardMid" />
          </div>
          <div>
            <label className="block text-sm text-darkest/70 mb-1">Tgl. Dokumen</label>
            <input type="date" required value={formData.tanggal} onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })} className="w-full px-3 py-2 bg-white border border-cardLight/30 rounded-xl text-darkest text-sm focus:outline-none focus:border-cardMid" />
          </div>
          <div>
            <label className="block text-sm text-darkest/70 mb-1">Sub Bagian</label>
            <input type="text" required value={formData.subBagian} onChange={(e) => setFormData({ ...formData, subBagian: e.target.value })} className="w-full px-3 py-2 bg-white border border-cardLight/30 rounded-xl text-darkest text-sm focus:outline-none focus:border-cardMid" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => { setShowEditModal(false); setEditTarget(null) }} className="flex-1 py-2.5 rounded-xl bg-gray-100 text-darkest/50 hover:bg-gray-200 transition-colors font-medium">Batal</button>
            <button type="submit" className="flex-1 py-2.5 rounded-xl bg-sidebar hover:bg-darkest text-white font-bold transition-colors">Simpan</button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => { setShowDeleteModal(false); setDeleteTarget(null) }}
        title="Konfirmasi Hapus"
        maxWidth="max-w-sm"
      >
        <p className="text-sm text-darkest/70 mb-6">
          Apakah Anda yakin ingin menghapus dokumen{' '}
          <span className="text-darkest font-medium">"{deleteTarget?.nama}"</span>?
        </p>
        <div className="flex gap-3">
          <button onClick={() => { setShowDeleteModal(false); setDeleteTarget(null) }} className="flex-1 py-2.5 rounded-xl bg-gray-100 text-darkest/50 hover:bg-gray-200 transition-colors font-medium">Batal</button>
          <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-colors">Hapus</button>
        </div>
      </Modal>
    </div>
  )
}

export default ArsipPage
