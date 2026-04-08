import { useSelector, useDispatch } from 'react-redux'
import { returnPeminjaman } from '../../features/peminjaman/peminjamanSlice'
import { addLog } from '../../features/log/logSlice'
import { useAuth } from '../../hooks/useAuth'
import Avatar from '../../components/common/Avatar'
import { RotateCcw } from 'lucide-react'

const RiwayatPeminjaman = () => {
  const dispatch = useDispatch()
  const { user } = useAuth()
  const records = useSelector((state) => state.peminjaman.records)

  const handleReturn = (record) => {
    dispatch(returnPeminjaman(record.id))
    dispatch(
      addLog({
        userId: user?.id,
        nama: user?.nama || 'User',
        aksi: 'Pengembalian',
        target: record.namaBarang,
      })
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-darkest">Riwayat Peminjaman</h1>
        <p className="text-sm text-cardLight mt-1">
          Daftar peminjaman inventaris kantor
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
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
                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      r.status === 'Dipinjam'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-5 py-3">
                  {r.status === 'Dipinjam' && (
                    <button
                      onClick={() => handleReturn(r)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sidebar text-white text-xs font-medium hover:bg-darkest transition-colors"
                    >
                      <RotateCcw size={13} />
                      Kembalikan
                    </button>
                  )}
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
    </div>
  )
}

export default RiwayatPeminjaman
