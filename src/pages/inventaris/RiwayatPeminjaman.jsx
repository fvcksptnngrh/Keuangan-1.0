import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { returnPeminjaman, approveReturn, rejectReturn } from '../../features/peminjaman/peminjamanSlice'
import { addLog } from '../../features/log/logSlice'
import { useAuth } from '../../hooks/useAuth'
import Avatar from '../../components/common/Avatar'
import Modal from '../../components/common/Modal'
import { RotateCcw, CheckCircle2, XCircle } from 'lucide-react'

const RiwayatPeminjaman = () => {
  const dispatch = useDispatch()
  const { user, isAdmin, isManagement } = useAuth()
  const records = useSelector((state) => state.peminjaman.records)
  const [confirmModal, setConfirmModal] = useState({ open: false, type: null, record: null })

  const canApprove = isAdmin || isManagement

  const openConfirm = (type, record) => {
    setConfirmModal({ open: true, type, record })
  }

  const closeConfirm = () => {
    setConfirmModal({ open: false, type: null, record: null })
  }

  const handleConfirm = () => {
    const { type, record } = confirmModal
    if (!record) return

    if (type === 'return') {
      dispatch(returnPeminjaman(record.id))
      dispatch(
        addLog({
          userId: user?.id,
          nama: user?.nama || 'User',
          aksi: 'Pengajuan Pengembalian',
          target: record.namaBarang,
        })
      )
    } else if (type === 'approve') {
      dispatch(approveReturn(record.id))
      dispatch(
        addLog({
          userId: user?.id,
          nama: user?.nama || 'User',
          aksi: 'Setujui Pengembalian',
          target: record.namaBarang,
        })
      )
    } else if (type === 'reject') {
      dispatch(rejectReturn(record.id))
      dispatch(
        addLog({
          userId: user?.id,
          nama: user?.nama || 'User',
          aksi: 'Tolak Pengembalian',
          target: record.namaBarang,
        })
      )
    }

    closeConfirm()
  }

  const statusStyle = (status) => {
    switch (status) {
      case 'Dipinjam':
        return 'bg-amber-100 text-amber-700'
      case 'Menunggu Persetujuan':
        return 'bg-blue-100 text-blue-700'
      case 'Dikembalikan':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const confirmMessages = {
    return: {
      title: 'Konfirmasi Pengembalian',
      body: 'Ajukan pengembalian barang ini? Pengembalian akan menunggu persetujuan admin/management.',
      button: 'Ajukan',
      buttonClass: 'bg-sidebar hover:bg-darkest',
    },
    approve: {
      title: 'Setujui Pengembalian',
      body: 'Setujui pengembalian barang ini?',
      button: 'Setujui',
      buttonClass: 'bg-green-600 hover:bg-green-700',
    },
    reject: {
      title: 'Tolak Pengembalian',
      body: 'Tolak pengembalian barang ini? Status akan kembali menjadi "Dipinjam".',
      button: 'Tolak',
      buttonClass: 'bg-red-500 hover:bg-red-600',
    },
  }

  const currentConfirm = confirmMessages[confirmModal.type] || {}

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-darkest">Riwayat Peminjaman</h1>
        <p className="text-sm text-cardLight mt-1">
          Daftar peminjaman inventaris kantor
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="bg-sidebar text-white text-left">
              <th className="px-5 py-3 font-semibold">Peminjam</th>
              <th className="px-5 py-3 font-semibold">Barang</th>
              <th className="px-5 py-3 font-semibold">Tgl Pinjam</th>
              <th className="px-5 py-3 font-semibold">Tgl Kembali</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => (
              <tr
                key={r.id}
                className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <Avatar size={28} nama={r.peminjam} />
                    <span className="font-medium text-darkest">
                      {r.peminjam}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3 text-darkest/70">{r.namaBarang}</td>
                <td className="px-5 py-3 text-darkest/70">
                  {r.tanggalPinjam}
                </td>
                <td className="px-5 py-3 text-darkest/70">
                  {r.tanggalKembali || '-'}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyle(r.status)}`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1.5">
                    {r.status === 'Dipinjam' && (
                      <button
                        onClick={() => openConfirm('return', r)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sidebar text-white text-xs font-medium hover:bg-darkest transition-colors"
                      >
                        <RotateCcw size={13} />
                        Kembalikan
                      </button>
                    )}
                    {r.status === 'Menunggu Persetujuan' && canApprove && (
                      <>
                        <button
                          onClick={() => openConfirm('approve', r)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle2 size={13} />
                          Setujui
                        </button>
                        <button
                          onClick={() => openConfirm('reject', r)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors"
                        >
                          <XCircle size={13} />
                          Tolak
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-cardLight">
                  Belum ada riwayat peminjaman
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmModal.open}
        onClose={closeConfirm}
        title={currentConfirm.title}
        maxWidth="max-w-sm"
      >
        <p className="text-sm text-darkest/70 mb-1">
          {confirmModal.record && (
            <span className="font-medium text-darkest">
              {confirmModal.record.namaBarang}
            </span>
          )}
        </p>
        <p className="text-sm text-darkest/70 mb-6">{currentConfirm.body}</p>
        <div className="flex gap-3">
          <button
            onClick={closeConfirm}
            className="flex-1 py-2.5 rounded-xl bg-gray-100 text-darkest/50 hover:bg-gray-200 transition-colors font-medium"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            className={`flex-1 py-2.5 rounded-xl text-white font-bold transition-colors ${currentConfirm.buttonClass}`}
          >
            {currentConfirm.button}
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default RiwayatPeminjaman
