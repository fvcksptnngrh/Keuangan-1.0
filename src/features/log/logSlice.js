import { createSlice } from '@reduxjs/toolkit'
import { fetchLogsThunk } from './logThunks'

const initialState = {
  logs: [],
  lastFetch: null,
  isLoading: false,
  error: null,
}

const logSlice = createSlice({
  name: 'log',
  initialState,
  reducers: {
    addLog(state, action) {
      const { userId, nama, aksi, target } = action.payload
      state.logs.unshift({
        id: Date.now(),
        userId,
        nama,
        aksi,
        target,
        waktu: new Date().toLocaleString('sv-SE').replace('T', ' '),
      })
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogsThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchLogsThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.logs = action.payload
        state.lastFetch = Date.now()
      })
      .addCase(fetchLogsThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || 'Gagal memuat log'
      })
  },
})

export const { addLog } = logSlice.actions
export default logSlice.reducer
