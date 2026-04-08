import { createSlice } from '@reduxjs/toolkit'
import {
  fetchArsipThunk,
  uploadArsipThunk,
  editArsipThunk,
  deleteArsipThunk,
  downloadArsipThunk,
} from './arsipThunks'

const initialState = {
  dokumenByKategori: {
    kepegawaian: [],
    keuangan: [],
    umum: [],
  },
  activeKategori: 'keuangan',
  isLoading: false,
  error: null,
  pagination: { page: 1, total: 0, limit: 10 },
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
        state.dokumenByKategori[action.meta.arg] = action.payload
        state.pagination.total = action.payload.length
      })
      .addCase(fetchArsipThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(uploadArsipThunk.fulfilled, (state, action) => {
        const kategori = action.meta.arg.kategori
        state.dokumenByKategori[kategori].unshift(action.payload)
        state.pagination.total += 1
      })
      .addCase(editArsipThunk.fulfilled, (state, action) => {
        const { kategori, ...doc } = action.payload
        const list = state.dokumenByKategori[kategori]
        const idx = list.findIndex((d) => d.id === doc.id)
        if (idx !== -1) list[idx] = { ...list[idx], ...doc }
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
  },
})

export const { setActiveKategori, setPage } = arsipSlice.actions
export default arsipSlice.reducer
