import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from '../hooks/useAuth'
import { fetchArsipThunk } from '../features/arsip/arsipThunks'
import DonutChart from '../components/common/DonutChart'
import Avatar from '../components/common/Avatar'

const Dashboard = () => {
  const dispatch = useDispatch()
  const { user } = useAuth()
  const { dokumenByKategori } = useSelector((state) => state.arsip)
  const logs = useSelector((state) => state.log.logs)

  useEffect(() => {
    dispatch(fetchArsipThunk('kepegawaian'))
    dispatch(fetchArsipThunk('keuangan'))
    dispatch(fetchArsipThunk('umum'))
  }, [dispatch])

  const totalDokumen =
    dokumenByKategori.kepegawaian.length +
    dokumenByKategori.keuangan.length +
    dokumenByKategori.umum.length

  const dokumenChartData = [
    { label: 'Kepegawaian', value: dokumenByKategori.kepegawaian.length, color: '#021024' },
    { label: 'Keuangan', value: dokumenByKategori.keuangan.length, color: '#052659' },
    { label: 'Umum', value: dokumenByKategori.umum.length, color: '#C1E8FF' },
  ]

  return (
    <div>
      <h1 className="text-2xl sm:text-4xl font-bold text-darkest mb-1">Dashboard Keuangan</h1>
      <p className="text-sm text-cardLight mb-8">
        Selamat datang, {user?.nama || 'User'}
      </p>

      {/* Stat Card */}
      <div className="mb-6">
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

      {/* Aktivitas Terakhir */}
      <div className="rounded-2xl bg-white p-6 shadow-sm mb-6">
        <h2 className="text-lg font-bold text-darkest mb-3">Aktivitas Terakhir</h2>
        <div className="border-t border-gray-200 pt-3 space-y-3 max-h-[200px] overflow-y-auto">
          {logs.slice(0, 10).map((act) => (
            <div key={act.id} className="flex items-start gap-3">
              <Avatar size={32} nama={act.nama} className="flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-sm text-darkest">
                  <span className="font-bold text-sidebar">{act.nama}</span>
                  {' '}[{act.aksi}] {act.target}
                </p>
                <p className="text-xs text-cardLight mt-0.5">{act.waktu}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-2xl bg-white p-6 shadow-sm flex flex-col items-center">
        <DonutChart data={dokumenChartData} title="Dokumen" />
      </div>
    </div>
  )
}

export default Dashboard
