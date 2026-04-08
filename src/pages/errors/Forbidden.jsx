import { useNavigate } from 'react-router-dom'
import { ShieldOff } from 'lucide-react'

const Forbidden = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-main flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-white shadow-sm flex items-center justify-center">
            <ShieldOff size={48} className="text-orange-400" />
          </div>
        </div>
        <h1 className="text-7xl font-bold text-[#00325A] mb-2">403</h1>
        <h2 className="text-xl font-semibold text-darkest mb-3">Akses Ditolak</h2>
        <p className="text-cardLight mb-8">
          Anda tidak memiliki izin untuk mengakses halaman ini.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 rounded-xl bg-white text-darkest font-medium shadow-sm hover:shadow-md transition-all"
          >
            Kembali
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

export default Forbidden
