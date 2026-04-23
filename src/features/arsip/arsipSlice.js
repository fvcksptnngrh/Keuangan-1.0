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

const emptyKategoriState = () => ({
  items: [],
  page: 1,
  cursorByPage: { 1: '' },
  nextCursor: null,
  hasMore: false,
})

const initialState = {
  byKategori: {
    kepegawaian: emptyKategoriState(),
    keuangan: emptyKategoriState(),
    umum: emptyKategoriState(),
  },
  activeKategori: 'keuangan',
  isLoading: false,
  error: null,
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
    },
    resetPagination(state, action) {
      const kategori = action.payload
      state.byKategori[kategori] = emptyKategoriState()
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
        const { kategori, items, nextCursor, hasMore, page, cursorUsed } = action.payload
        const branch = state.byKategori[kategori]
        branch.items = items
        branch.page = page
        branch.nextCursor = nextCursor
        branch.hasMore = hasMore
        branch.cursorByPage[page] = cursorUsed ?? ''
      })
      .addCase(fetchArsipThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(uploadArsipThunk.fulfilled, () => {
        // Refetch is triggered from the component after upload succeeds.
      })
      .addCase(editArsipThunk.fulfilled, () => {
        // Refetch is triggered from the component after edit succeeds.
      })
      .addCase(deleteArsipThunk.fulfilled, () => {
        // Refetch is triggered from the component after delete succeeds.
      })
      .addCase(downloadArsipThunk.fulfilled, () => {})
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

export const { setActiveKategori, resetPagination } = arsipSlice.actions
export default arsipSlice.reducer
