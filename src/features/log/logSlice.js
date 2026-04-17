import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  logs: [],
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
})

export const { addLog } = logSlice.actions
export default logSlice.reducer
