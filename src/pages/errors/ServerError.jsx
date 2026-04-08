import { useNavigate } from 'react-router-dom'
import { ServerCrash } from 'lucide-react'

const ServerError = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-main flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-white shadow-sm flex items-center justify-center">
            <ServerCrash size={48} className="text-red-400" />
          </div>
        </div>
        <h1 className="text-7xl font-bold text-[#00325A] mb-2">500</h1>
        <h2 className="text-xl font-semibold text-darkest mb-3">Kesalahan Server</h2>
        <p className="text-cardLight mb-8">
          Terjadi kesalahan pada server. Silakan coba beberapa saat lagi.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 rounded-xl bg-white text-darkest font-medium shadow-sm hover:shadow-md transition-all"
          >
            Muat Ulang
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2.5 rounded-xl text-white font-bold transition-colors hover:bg-darkest"
            style={{ backgroundColor: '#00325A' }}
          >
            Ke Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

export default ServerError
