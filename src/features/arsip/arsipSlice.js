import { createSlice } from '@reduxjs/toolkit'
import {
  fetchArsipThunk,
  uploadArsipThunk,
  editArsipThunk,
  deleteArsipThunk,
  downloadArsipThunk,
  fetchNewestArsipThunk,
  fetchArsipCountThunk,
} from './arsipThunks'

const initialState = {
  dokumenByKategori: {
    kepegawaian: [],
    keuangan: [],
    umum: [],
  },
  lastFetch: {},
  activeKategori: 'keuangan',
  isLoading: false,
  error: null,
  pagination: { page: 1, total: 0, limit: 10 },
  newestArsip: [],
  totalDokumen: 0,
  totalKepegawaian: 0,
  totalKeuangan: 0,
  totalUmum: 0,
}

const arsipSlice = createSlice({
  name: 'arsip',
  initialState,
  reducers: {
    setActiveKategori(state, action) {
      state.activeKategori = action.payload
      state.pagination.page = 1
    },
    setPage(state, action) {
      state.pagination.page = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArsipThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchArsipThunk.fulfilled, (state, action) => {
        state.isLoading = false
        const kategori = action.meta.arg
        state.dokumenByKategori[kategori] = action.payload
        state.lastFetch[kategori] = Date.now()
        state.pagination.total = action.payload.length
      })
      .addCase(fetchArsipThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(uploadArsipThunk.fulfilled, (state, action) => {
        // Real API: refetch handled in component. Mock: push directly.
        if (!action.payload?.refetch) {
          const kategori = action.meta.arg.kategori
          state.dokumenByKategori[kategori].unshift(action.payload)
          state.pagination.total += 1
        }
      })
      .addCase(editArsipThunk.fulfilled, (state, action) => {
        // Real API: refetch handled in component. Mock: update directly.
        if (!action.payload?.refetch) {
          const { kategori, ...doc } = action.payload
          const list = state.dokumenByKategori[kategori]
          const idx = list.findIndex((d) => d.id === doc.id)
          if (idx !== -1) list[idx] = { ...list[idx], ...doc }
        }
      })
      .addCase(deleteArsipThunk.fulfilled, (state, action) => {
        const { id, kategori } = action.payload
        state.dokumenByKategori[kategori] = state.dokumenByKategori[kategori].filter(
          (d) => d.id !== id
        )
        state.pagination.total -= 1
      })
      .addCase(downloadArsipThunk.fulfilled, () => {
        // Download handled in thunk
      })
      .addCase(fetchNewestArsipThunk.fulfilled, (state, action) => {
        state.newestArsip = action.payload
      })
      .addCase(fetchArsipCountThunk.fulfilled, (state, action) => {
        state.totalDokumen = action.payload.totalDokumen
        state.totalKepegawaian = action.payload.totalKepegawaian
        state.totalKeuangan = action.payload.totalKeuangan
        state.totalUmum = action.payload.totalUmum
      })
  },
})

export const { setActiveKategori, setPage } = arsipSlice.actions
export default arsipSlice.reducer
