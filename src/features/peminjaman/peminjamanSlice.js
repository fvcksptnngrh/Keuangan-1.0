import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  records: [],
}

const peminjamanSlice = createSlice({
  name: 'peminjaman',
  initialState,
  reducers: {
    addPeminjaman(state, action) {
      state.records.unshift({
        id: Date.now(),
        ...action.payload,
        tanggalPinjam: new Date().toISOString().split('T')[0],
        tanggalKembali: null,
        status: 'Dipinjam',
      })
    },
    returnPeminjaman(state, action) {
      const record = state.records.find((r) => r.id === action.payload)
      if (record) {
        record.status = 'Menunggu Persetujuan'
      }
    },
    approveReturn(state, action) {
      const record = state.records.find((r) => r.id === action.payload)
      if (record && record.status === 'Menunggu Persetujuan') {
        record.status = 'Dikembalikan'
        record.tanggalKembali = new Date().toISOString().split('T')[0]
      }
    },
    rejectReturn(state, action) {
      const record = state.records.find((r) => r.id === action.payload)
      if (record && record.status === 'Menunggu Persetujuan') {
        record.status = 'Dipinjam'
      }
    },
  },
})

export const { addPeminjaman, returnPeminjaman, approveReturn, rejectReturn } = peminjamanSlice.actions
export default peminjamanSlice.reducer
