import { createSlice } from '@reduxjs/toolkit'
import { fetchInventarisThunk, pinjamInventarisThunk, createInventarisThunk, updateInventarisThunk, deleteInventarisThunk } from './inventarisThunks'

const initialState = {
  items: [],
  selectedItem: null,
  isLoading: false,
  error: null,
  pagination: { page: 1, total: 0, limit: 12 },
}

const inventarisSlice = createSlice({
  name: 'inventaris',
  initialState,
  reducers: {
    setSelectedItem(state, action) {
      state.selectedItem = action.payload
    },
    clearSelectedItem(state) {
      state.selectedItem = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventarisThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchInventarisThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
        state.pagination.total = action.payload.length
      })
      .addCase(fetchInventarisThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(pinjamInventarisThunk.pending, (state, action) => {
        // Optimistic update
        const item = state.items.find((i) => i.id === action.meta.arg)
        if (item && item.stok > 0) {
          item.stok -= 1
        }
      })
      .addCase(pinjamInventarisThunk.fulfilled, () => {
        // Already updated optimistically
      })
      .addCase(pinjamInventarisThunk.rejected, (state, action) => {
        // Rollback
        const item = state.items.find((i) => i.id === action.meta.arg)
        if (item) {
          item.stok += 1
        }
        state.error = action.payload
      })
      .addCase(createInventarisThunk.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(updateInventarisThunk.fulfilled, (state, action) => {
        const index = state.items.findIndex((i) => i.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(deleteInventarisThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.payload)
      })
  },
})

export const { setSelectedItem, clearSelectedItem } = inventarisSlice.actions
export default inventarisSlice.reducer
