import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchInventarisThunk, pinjamInventarisThunk } from '../../features/inventaris/inventarisThunks'
import { addPeminjaman } from '../../features/peminjaman/peminjamanSlice'
import { addLog } from '../../features/log/logSlice'
import { useAuth } from '../../hooks/useAuth'
import SearchBar from '../../components/common/SearchBar'
import Modal from '../../components/common/Modal'
import { Package } from 'lucide-react'

const KatalogBarang = () => {
  const dispatch = useDispatch()
  const { user } = useAuth()
  const { items, isLoading } = useSelector((state) => state.inventaris)
  const [search, setSearch] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [borrowing, setBorrowing] = useState(false)

  useEffect(() => {
    dispatch(fetchInventarisThunk())
  }, [dispatch])

  const filteredItems = items.filter((item) =>
    item.nama.toLowerCase().includes(search.toLowerCase())
  )

  const handleCardClick = (item) => {
    setSelectedItem(item)
    setShowModal(true)
  }

  const handlePinjam = async () => {
    if (!selectedItem || selectedItem.stok <= 0) return
    setBorrowing(true)
    await dispatch(pinjamInventarisThunk(selectedItem.id))
    dispatch(
      addPeminjaman({
        peminjam: user?.nama || 'User',
        namaBarang: selectedItem.nama,
        barangId: selectedItem.id,
      })
    )
    dispatch(
      addLog({
        userId: user?.id,
        nama: user?.nama || 'User',
        aksi: 'Peminjaman',
        target: selectedItem.nama,
      })
    )
    setBorrowing(false)
    setShowModal(false)
    setSelectedItem(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-darkest">Katalog Barang</h1>
          <p className="text-sm text-cardLight mt-1">Inventaris Persediaan Kantor</p>
        </div>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Cari barang..."
          className="w-64"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-cardMid border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleCardClick(item)}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all duration-200"
            >
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                {item.gambar ? (
                  <img
                    src={item.gambar}
                    alt={item.nama}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package size={64} className="text-cardLight/40" />
                )}
              </div>
              <div className="p-4 text-center">
                <h3 className="text-sidebar font-bold text-sm">{item.nama}</h3>
                <p
                  className={`text-xs mt-1 ${
                    item.stok === 0 ? 'text-red-500' : 'text-cardMid'
                  }`}
                >
                  Stock | {item.stok === 0 ? 'Kosong' : item.stok}
                </p>
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="col-span-3 text-center py-20 text-cardLight">
              Tidak ada barang ditemukan
            </div>
          )}
        </div>
      )}

      {/* Modal Konfirmasi Pinjam */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setSelectedItem(null)
        }}
        maxWidth="max-w-md"
      >
        {selectedItem && (
          <div className="flex flex-col items-center">
            <div className="w-[200px] h-[200px] bg-gray-100 rounded-xl flex items-center justify-center mb-4">
              {selectedItem.gambar ? (
                <img
                  src={selectedItem.gambar}
                  alt={selectedItem.nama}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <Package size={80} className="text-cardLight/40" />
              )}
            </div>
            <h3 className="text-lg font-bold text-darkest mb-2">
              {selectedItem.nama}
            </h3>
            <p className="text-sm text-cardLight text-center mb-6">
              Silakan konfirmasi: Apakah Anda akan mengambil/meminjam barang ini?
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => {
                  setShowModal(false)
                  setSelectedItem(null)
                }}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 text-darkest/50 hover:bg-gray-200 transition-colors font-medium"
              >
                Batal
              </button>
              <button
                onClick={handlePinjam}
                disabled={selectedItem.stok <= 0 || borrowing}
                className="flex-1 py-2.5 rounded-xl bg-sidebar text-white font-bold hover:bg-darkest transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {borrowing ? 'Memproses...' : 'Ya'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default KatalogBarang
