import { useEffect, useState, useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchArsipThunk, uploadArsipThunk, editArsipThunk, deleteArsipThunk, downloadArsipThunk, previewArsipThunk } from '../../features/arsip/arsipThunks'
import { addLog } from '../../features/log/logSlice'
import { useAuth } from '../../hooks/useAuth'
import { canAccess } from '../../utils/roleGuard'
import Table from '../common/Table'
import Pagination from '../common/Pagination'
import SearchBar from '../common/SearchBar'
import Modal from '../common/Modal'
import { Plus, FileText, Download, Trash2, Pencil, Eye, Loader2, UploadCloud, X, ChevronDown } from 'lucide-react'

const KATEGORI_OPTIONS = {
  kepegawaian: [
    'Absensi Apel',
    'Surat Cuti dan Izin Pegawai',
    'Surat Perintah dan Perjadin',
    'Jurnal Harian',
    'Nota Dinas',
    'Kenaikan Gaji Berkala',
    'Sasaran Kinerja Pegawai (SKP)',
    'SK',
    'Draft dan Form',
  ],
  keuangan: [
    'Belanja Barang',
    'Belanja Modal',
    'Belanja Pegawai',
  ],
  umum: [],
}

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
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [previewName, setPreviewName] = useState('')
  const [isDragging, setIsDragging] = useState(false)
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
        (doc.nama || '').toLowerCase().includes(search.toLowerCase()) ||
        (doc.noDokumen || '').toLowerCase().includes(search.toLowerCase())
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

  // Build FormData with real API field names
  const buildFormData = (data, includeFile = false) => {
    const fd = new FormData()
    fd.append('name', data.nama)
    fd.append('number', data.noDokumen)
    fd.append('created_date', data.tanggal)
    fd.append('category', data.subBagian)
    fd.append('division', kategori)
    if (includeFile && data.file) {
      fd.append('file', data.file)
    }
    return fd
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    const fd = buildFormData(formData, true)
    await dispatch(uploadArsipThunk({ kategori, formData: fd }))
    dispatch(addLog({ userId: user.id, nama: user.nama, aksi: 'Mengunggah', target: formData.nama }))
    setShowUploadModal(false)
    setFormData({ nama: '', noDokumen: '', tanggal: '', subBagian: '', file: null })
    dispatch(fetchArsipThunk(kategori))
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
    const fd = buildFormData(formData)
    await dispatch(editArsipThunk({ id: editTarget.id, kategori, formData: fd }))
    setShowEditModal(false)
    setEditTarget(null)
    setFormData({ nama: '', noDokumen: '', tanggal: '', subBagian: '', file: null })
    dispatch(fetchArsipThunk(kategori))
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await dispatch(deleteArsipThunk({ id: deleteTarget.id, kategori }))
    dispatch(addLog({ userId: user.id, nama: user.nama, aksi: 'Menghapus', target: deleteTarget.nama }))
    setShowDeleteModal(false)
    setDeleteTarget(null)
  }

  const handleDownload = (doc) => {
    dispatch(downloadArsipThunk({ fileUrl: doc.file, fileName: doc.nama || 'dokumen.pdf' }))
    dispatch(addLog({ userId: user.id, nama: user.nama, aksi: 'Mengunduh', target: doc.nama }))
  }

  const handlePreview = useCallback(async (doc) => {
    if (!doc.file) return
    setPreviewName(doc.nama || 'Dokumen')
    setPreviewLoading(true)
    setShowPreviewModal(true)
    setPreviewUrl(null)

    try {
      const result = await dispatch(previewArsipThunk(doc.file)).unwrap()
      setPreviewUrl(result)
    } catch {
      setPreviewUrl(null)
    } finally {
      setPreviewLoading(false)
    }
  }, [dispatch])

  const closePreview = useCallback(() => {
    setShowPreviewModal(false)
    setPreviewUrl(null)
    setPreviewName('')
  }, [])

  const columns = [
    {
      key: 'no',
      label: 'No',
      render: (_, index) => (page - 1) * ITEMS_PER_PAGE + index + 1,
    },
    { key: 'nama', label: 'Nama Dokumen', sortable: true },
    { key: 'noDokumen', label: 'No. Dokumen', sortable: true },
    { key: 'tanggal', label: 'Tgl. Dokumen', sortable: true },
    { key: 'subBagian', label: 'Kategori', sortable: true },
    {
      key: 'aksi',
      label: 'Aksi',
      render: (row) => (
        <div className="flex items-center gap-1">
          {canDownload && row.file && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handlePreview(row)
                }}
                className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-500 transition-colors"
                title="Preview"
              >
                <Eye size={16} />
              </button>
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
      <h1 className="text-2xl sm:text-3xl font-bold text-darkest">{judul}</h1>
      <p className="text-sm text-cardLight mt-1 mb-6">{subjudul}</p>

      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 mb-4">
          {canCrud && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-sidebar hover:bg-darkest rounded-full text-white text-sm font-medium transition-colors"
            >
              <Plus size={16} />
              Unggah
            </button>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:ml-auto">
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="flex-1 sm:flex-none px-3 py-1.5 bg-white border border-cardLight/30 rounded-full text-xs text-darkest focus:outline-none focus:border-cardMid"
              />
              <span className="text-cardLight text-xs">-</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="flex-1 sm:flex-none px-3 py-1.5 bg-white border border-cardLight/30 rounded-full text-xs text-darkest focus:outline-none focus:border-cardMid"
              />
            </div>
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Cari dokumen..."
              className="w-full sm:w-52"
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
            <label className="block text-sm text-darkest/70 mb-1">Kategori</label>
            {(KATEGORI_OPTIONS[kategori] || []).length > 0 ? (
              <div className="relative">
                <select required value={formData.subBagian} onChange={(e) => setFormData({ ...formData, subBagian: e.target.value })} className="w-full px-3 py-2.5 bg-white border border-cardLight/30 rounded-xl text-darkest text-sm focus:outline-none focus:border-sidebar focus:ring-1 focus:ring-sidebar/20 appearance-none cursor-pointer pr-9">
                  <option value="" className="text-cardLight">-- Pilih Kategori --</option>
                  {KATEGORI_OPTIONS[kategori].map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-cardLight pointer-events-none" />
              </div>
            ) : (
              <input type="text" required value={formData.subBagian} onChange={(e) => setFormData({ ...formData, subBagian: e.target.value })} className="w-full px-3 py-2.5 bg-white border border-cardLight/30 rounded-xl text-darkest text-sm focus:outline-none focus:border-sidebar focus:ring-1 focus:ring-sidebar/20" placeholder="Masukkan kategori" />
            )}
          </div>
          <div>
            <label className="block text-sm text-darkest/70 mb-1">Divisi</label>
            <input type="text" readOnly value={kategori} className="w-full px-3 py-2.5 bg-gray-50 border border-cardLight/30 rounded-xl text-darkest text-sm cursor-not-allowed capitalize" />
          </div>
          <div>
            <label className="block text-sm text-darkest/70 mb-1">Upload File</label>
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault()
                setIsDragging(false)
                const file = e.dataTransfer.files[0]
                if (file) setFormData({ ...formData, file })
              }}
              className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                isDragging
                  ? 'border-sidebar bg-sidebar/5 scale-[1.01]'
                  : formData.file
                    ? 'border-sidebar/40 bg-sidebar/5'
                    : 'border-cardLight/40 hover:border-cardMid hover:bg-gray-50'
              }`}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <input
                id="file-upload"
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                className="hidden"
              />
              {formData.file ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sidebar/10 flex items-center justify-center">
                    <FileText size={20} className="text-sidebar" />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-sm font-medium text-darkest truncate max-w-[200px]">{formData.file.name}</p>
                    <p className="text-xs text-cardLight">{(formData.file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setFormData({ ...formData, file: null }) }}
                    className="p-1 rounded-lg hover:bg-red-50 text-cardLight hover:text-red-500 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-sidebar/10 flex items-center justify-center">
                    <UploadCloud size={22} className="text-sidebar" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-darkest">
                      {isDragging ? 'Lepaskan file di sini' : 'Drag & drop file atau klik untuk pilih'}
                    </p>
                    <p className="text-xs text-cardLight mt-0.5">PDF, DOC, DOCX, XLS, XLSX</p>
                  </div>
                </div>
              )}
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
            <label className="block text-sm text-darkest/70 mb-1">Kategori</label>
            {(KATEGORI_OPTIONS[kategori] || []).length > 0 ? (
              <div className="relative">
                <select required value={formData.subBagian} onChange={(e) => setFormData({ ...formData, subBagian: e.target.value })} className="w-full px-3 py-2.5 bg-white border border-cardLight/30 rounded-xl text-darkest text-sm focus:outline-none focus:border-sidebar focus:ring-1 focus:ring-sidebar/20 appearance-none cursor-pointer pr-9">
                  <option value="" className="text-cardLight">-- Pilih Kategori --</option>
                  {KATEGORI_OPTIONS[kategori].map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-cardLight pointer-events-none" />
              </div>
            ) : (
              <input type="text" required value={formData.subBagian} onChange={(e) => setFormData({ ...formData, subBagian: e.target.value })} className="w-full px-3 py-2.5 bg-white border border-cardLight/30 rounded-xl text-darkest text-sm focus:outline-none focus:border-sidebar focus:ring-1 focus:ring-sidebar/20" placeholder="Masukkan kategori" />
            )}
          </div>
          <div>
            <label className="block text-sm text-darkest/70 mb-1">Divisi</label>
            <input type="text" readOnly value={kategori} className="w-full px-3 py-2.5 bg-gray-50 border border-cardLight/30 rounded-xl text-darkest text-sm cursor-not-allowed capitalize" />
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

      {/* PDF Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-[9999]">
          {/* Backdrop blur */}

          {/* Modal container — offset by sidebar on desktop */}
          <div className="absolute inset-0 lg:left-[260px] flex items-center pt-80 justify-start pl-4 sm:pl-6">
            <div className="relative w-[90%] max-w-7xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden" style={{ height: '75vh' }}>
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-sidebar/10 flex items-center justify-center flex-shrink-0">
                    <FileText size={16} className="text-sidebar" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-darkest truncate">{previewName}</p>
                    <p className="text-xs text-cardLight">Preview Dokumen</p>
                  </div>
                </div>
                <button
                  onClick={closePreview}
                  className="p-2 rounded-xl hover:bg-gray-200 transition-colors flex-shrink-0"
                  title="Tutup"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-darkest/60"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>

              {/* PDF Content */}
              <div className="flex-1 bg-gray-100 flex items-center justify-center overflow-hidden">
                {previewLoading ? (
                  <div className="flex flex-col items-center gap-3 text-darkest/40">
                    <Loader2 size={36} className="animate-spin" />
                    <span className="text-sm">Memuat dokumen...</span>
                  </div>
                ) : previewUrl ? (
                  <iframe
                    src={previewUrl}
                    title={previewName}
                    className="w-full h-full border-0 bg-white"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3 text-darkest/40">
                    <FileText size={48} className="opacity-50" />
                    <span className="text-sm">Gagal memuat preview dokumen</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ArsipPage
