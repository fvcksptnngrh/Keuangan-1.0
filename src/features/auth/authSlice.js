import { createSlice } from '@reduxjs/toolkit'
import { loginThunk, getMeThunk, logoutThunk } from './authThunks'

const initialState = {
  user: null,
  token: null,
  role: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action) {
      state.user = action.payload.user
      state.token = action.payload.token
      state.role = action.payload.user?.role || action.payload.role
      state.isAuthenticated = true
      state.error = null
    },
    clearCredentials(state) {
      state.user = null
      state.token = null
      state.role = null
      state.isAuthenticated = false
      state.error = null
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.role = action.payload.user.role
        state.isAuthenticated = true
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || 'Login gagal'
      })
      .addCase(getMeThunk.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getMeThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.role = action.payload.role
        state.isAuthenticated = true
      })
      .addCase(getMeThunk.rejected, (state) => {
        state.isLoading = false
        state.user = null
        state.token = null
        state.role = null
        state.isAuthenticated = false
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.role = null
        state.isAuthenticated = false
      })
  },
})

export const { setCredentials, clearCredentials, clearError } = authSlice.actions
export default authSlice.reducer
