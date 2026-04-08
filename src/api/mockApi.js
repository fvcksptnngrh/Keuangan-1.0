import {
  users,
  inventaris,
  arsipKepegawaian,
  arsipKeuangan,
  arsipUmum,
  withDelay,
} from '../utils/mockData'

const arsipMap = {
  kepegawaian: arsipKepegawaian,
  keuangan: arsipKeuangan,
  umum: arsipUmum,
}

// Auth
export const mockLoginApi = ({ username, password }) => {
  const user = users.find(
    (u) => u.username === username && u.password === password
  )
  if (!user) {
    return Promise.reject({
      response: { status: 401, data: { message: 'Username atau password salah' } },
    })
  }
  const { password: _, ...userWithoutPassword } = user
  return withDelay({
    token: `mock-jwt-token-${user.role}-${Date.now()}`,
    user: userWithoutPassword,
  })
}

export const mockLogoutApi = () => withDelay({ message: 'Logout berhasil' })

export const mockGetMeApi = () => {
  const token = localStorage.getItem('token')
  if (!token) {
    return Promise.reject({ response: { status: 401 } })
  }
  const role = token.split('-')[3]
  const user = users.find((u) => u.role === role)
  if (!user) return Promise.reject({ response: { status: 401 } })
  const { password: _, ...userWithoutPassword } = user
  return withDelay(userWithoutPassword)
}

// Inventaris
let mockInventaris = [...inventaris]

export const mockGetInventarisApi = () => withDelay(mockInventaris)

export const mockGetInventarisByIdApi = (id) => {
  const item = mockInventaris.find((i) => i.id === id)
  return item
    ? withDelay(item)
    : Promise.reject({ response: { status: 404 } })
}

export const mockCreateInventarisApi = (data) => {
  const newItem = { ...data, id: Date.now() }
  mockInventaris.push(newItem)
  return withDelay(newItem)
}

export const mockUpdateInventarisApi = (id, data) => {
  const index = mockInventaris.findIndex((i) => i.id === id)
  if (index === -1) return Promise.reject({ response: { status: 404 } })
  mockInventaris[index] = { ...mockInventaris[index], ...data }
  return withDelay(mockInventaris[index])
}

export const mockDeleteInventarisApi = (id) => {
  mockInventaris = mockInventaris.filter((i) => i.id !== id)
  return withDelay({ message: 'Deleted' })
}

export const mockPinjamInventarisApi = (id) => {
  const item = mockInventaris.find((i) => i.id === id)
  if (!item) return Promise.reject({ response: { status: 404 } })
  if (item.stok <= 0)
    return Promise.reject({
      response: { status: 400, data: { message: 'Stok habis' } },
    })
  item.stok -= 1
  return withDelay({ message: 'Peminjaman berhasil', item })
}

export const mockRiwayatPeminjamanApi = () => withDelay([])

// Arsip
const mockArsip = {
  kepegawaian: [...arsipKepegawaian],
  keuangan: [...arsipKeuangan],
  umum: [...arsipUmum],
}

export const mockGetArsipApi = (kategori) =>
  withDelay(mockArsip[kategori] || [])

export const mockGetArsipByIdApi = (id) => {
  for (const kategori of Object.values(mockArsip)) {
    const doc = kategori.find((d) => d.id === id)
    if (doc) return withDelay(doc)
  }
  return Promise.reject({ response: { status: 404 } })
}

export const mockUploadArsipApi = (kategori, formData) => {
  const newDoc = {
    id: Date.now(),
    nama: formData.get?.('nama') || 'Dokumen Baru',
    noDokumen: formData.get?.('noDokumen') || 'NEW/001',
    tanggal: formData.get?.('tanggal') || new Date().toISOString().split('T')[0],
    subBagian: formData.get?.('subBagian') || kategori,
    file: formData.get?.('file')?.name || 'dokumen.pdf',
  }
  if (mockArsip[kategori]) {
    mockArsip[kategori].unshift(newDoc)
  }
  return withDelay(newDoc)
}

export const mockEditArsipApi = (id, data) => {
  for (const kategori of Object.keys(mockArsip)) {
    const doc = mockArsip[kategori].find((d) => d.id === id)
    if (doc) {
      Object.assign(doc, data)
      return withDelay(doc)
    }
  }
  return Promise.reject({ response: { status: 404 } })
}

export const mockDeleteArsipApi = (id) => {
  for (const kategori of Object.keys(mockArsip)) {
    mockArsip[kategori] = mockArsip[kategori].filter((d) => d.id !== id)
  }
  return withDelay({ message: 'Deleted' })
}

export const mockDownloadArsipApi = () =>
  withDelay(new Blob(['mock file content'], { type: 'application/pdf' }))

export const mockSearchArsipApi = (kategori, query) => {
  const results = (mockArsip[kategori] || []).filter(
    (d) =>
      d.nama.toLowerCase().includes(query.toLowerCase()) ||
      d.noDokumen.toLowerCase().includes(query.toLowerCase())
  )
  return withDelay(results)
}
