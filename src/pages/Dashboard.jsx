import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from '../hooks/useAuth'
import { fetchNewestArsipThunk, fetchArsipCountThunk } from '../features/arsip/arsipThunks'
import { fetchLogsThunk } from '../features/log/logThunks'
import DonutChart from '../components/common/DonutChart'
import Avatar from '../components/common/Avatar'

const formatAction = (aksi) => {
  const map = { delete: 'menghapus', update: 'mengubah', create: 'menambah', login: 'login' }
  return map[aksi?.toLowerCase()] || aksi
}

const Dashboard = () => {
  const dispatch = useDispatch()
  const { isAuthenticated } = useAuth()
  const { newestArsip, totalDokumen, totalKepegawaian, totalKeuangan, totalUmum } = useSelector((state) => state.arsip)
  const logs = useSelector((state) => state.log.logs)

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchLogsThunk({ limit: 5 }))
      dispatch(fetchNewestArsipThunk())
      dispatch(fetchArsipCountThunk())
    }
  }, [dispatch, isAuthenticated])

  const dokumenChartData = [
    { label: 'Kepegawaian', value: totalKepegawaian, color: '#021024' },
    { label: 'Keuangan', value: totalKeuangan, color: '#052659' },
    { label: 'Umum', value: totalUmum, color: '#C1E8FF' },
  ]

  return (
    <div>
      {/* Page header */}
      <h1 className="text-3xl font-bold text-darkest mb-0.5">PorTU</h1>
      <p className="text-sm text-cardLight mb-6">Portal Tata Usana</p>

      {/* Top section: 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        {/* Left column */}
        <div className="flex flex-col gap-4">
          {/* Aktivitas Terakhir */}
          <div
            className="rounded-2xl p-5 flex-1 min-h-[220px]"
            style={{ background: 'linear-gradient(145deg, #5B8FB9 0%, #2B5F8E 40%, #052659 100%)' }}
          >
            <h2 className="text-sm font-semibold text-white/90 mb-4">Aktivitas Terakhir</h2>
            <div className="space-y-3">
              {logs.length === 0 && (
                <p className="text-white/50 text-xs">Belum ada aktivitas.</p>
              )}
              {logs.slice(0, 5).map((act) => (
                <div key={act.id} className="flex items-start gap-2.5">
                  <Avatar size={28} nama={act.nama} className="flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-xs text-white/90 leading-snug">
                      <span className="font-semibold">{act.nama}</span>
                      {' '}{formatAction(act.aksi)}{' '}
                      <span className="italic opacity-80">{act.target}</span>
                    </p>
                    <p className="text-[10px] text-white/50 mt-0.5">{act.waktu}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total Dokumen stat */}
          <div
            className="rounded-2xl py-5 px-7 flex items-center justify-between"
            style={{ background: 'linear-gradient(135deg, #052659 0%, #021024 100%)' }}
          >
            <div />
            <div className="text-right">
              <p className="text-4xl font-bold text-white">{totalDokumen}</p>
              <p className="text-sm text-accent mt-1">Total Dokumen</p>
            </div>
          </div>
        </div>

        {/* Right column: Donut chart */}
        <div className="rounded-2xl bg-white p-6 shadow-sm flex flex-col items-center justify-center">
          <DonutChart data={dokumenChartData} title="Dokumen" />
        </div>
      </div>

      {/* Arsip Terbaru */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-darkest mb-5">Arsip Terbaru</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['No', 'Nama Dokumen', 'No. Dokumen', 'Tgl. Unggah', 'Bagian/Divisi', 'Kategori'].map((col) => (
                  <th
                    key={col}
                    className="text-left py-2.5 px-3 text-xs font-semibold text-cardLight whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {newestArsip.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-cardLight text-xs">
                    Belum ada data arsip.
                  </td>
                </tr>
              )}
              {newestArsip.map((doc, idx) => (
                <tr key={doc.id} className="border-b border-gray-50 hover:bg-gray-50/70 transition-colors">
                  <td className="py-3 px-3 text-darkest/70">{idx + 1}</td>
                  <td className="py-3 px-3 text-darkest font-medium">{doc.nama}</td>
                  <td className="py-3 px-3 text-darkest/70">{doc.noDokumen}</td>
                  <td className="py-3 px-3 text-darkest/70 whitespace-nowrap">{doc.tanggal}</td>
                  <td className="py-3 px-3 text-darkest/70 capitalize">{doc.division}</td>
                  <td className="py-3 px-3 text-darkest/70 capitalize">{doc.subBagian}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
