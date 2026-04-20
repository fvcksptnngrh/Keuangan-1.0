import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Search, Clock, Loader2 } from 'lucide-react'
import Avatar from '../../components/common/Avatar'
import { fetchLogsThunk } from '../../features/log/logThunks'

const LogAktivitas = () => {
  const dispatch = useDispatch()
  const logs = useSelector((state) => state.log.logs)
  const isLoading = useSelector((state) => state.log.isLoading)
  const error = useSelector((state) => state.log.error)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const perPage = 15

  useEffect(() => {
    dispatch(fetchLogsThunk())
  }, [dispatch])

  const filtered = logs.filter(
    (log) =>
      log.nama?.toLowerCase().includes(search.toLowerCase()) ||
      log.aksi?.toLowerCase().includes(search.toLowerCase()) ||
      log.target?.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-darkest">Log Aktivitas</h1>
          <p className="text-sm text-cardLight mt-1">
            Riwayat aktivitas pengguna sistem
          </p>
        </div>
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-cardLight"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder="Cari aktivitas..."
            className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-cardMid/30"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[540px]">
          <thead>
            <tr className="bg-sidebar text-white text-left">
              <th className="px-5 py-3 font-semibold">Pengguna</th>
              <th className="px-5 py-3 font-semibold">Aksi</th>
              <th className="px-5 py-3 font-semibold">Target</th>
              <th className="px-5 py-3 font-semibold">Waktu</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={4} className="text-center py-12 text-cardLight">
                  <div className="inline-flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    Memuat log...
                  </div>
                </td>
              </tr>
            )}
            {!isLoading && error && (
              <tr>
                <td colSpan={4} className="text-center py-12 text-red-500">
                  {error}
                </td>
              </tr>
            )}
            {!isLoading && !error && paginated.map((log, i) => (
              <tr
                key={log.id}
                className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <Avatar size={28} nama={log.nama} />
                    <span className="font-medium text-darkest">
                      {log.nama}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-cardMid/10 text-sidebar text-xs font-semibold">
                    {log.aksi}
                  </span>
                </td>
                <td className="px-5 py-3 text-darkest/70">{log.target}</td>
                <td className="px-5 py-3 text-cardLight">
                  <div className="flex items-center gap-1.5">
                    <Clock size={13} />
                    {log.waktu}
                  </div>
                </td>
              </tr>
            ))}
            {!isLoading && !error && paginated.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-12 text-cardLight">
                  Tidak ada log ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
            <p className="text-xs text-cardLight">
              Menampilkan {(page - 1) * perPage + 1}–
              {Math.min(page * perPage, filtered.length)} dari {filtered.length}
            </p>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                    page === i + 1
                      ? 'bg-sidebar text-white'
                      : 'text-darkest/50 hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LogAktivitas
