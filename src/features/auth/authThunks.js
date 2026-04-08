import { createAsyncThunk } from '@reduxjs/toolkit'
import { loginApi, logoutApi, getMeApi } from '../../api/authApi'
import { mockLoginApi, mockLogoutApi, mockGetMeApi } from '../../api/mockApi'

const useMock = import.meta.env.VITE_USE_MOCK === 'true'

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const api = useMock ? mockLoginApi : loginApi
      const response = await api(credentials)
      const { token, user } = response.data
      localStorage.setItem('token', token)
      return { token, user }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Username atau password salah'
      )
    }
  }
)

export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  try {
    const api = useMock ? mockLogoutApi : logoutApi
    await api()
  } finally {
    localStorage.removeItem('token')
  }
})

export const getMeThunk = createAsyncThunk(
  'auth/getMe',
  async (_, { rejectWithValue }) => {
    try {
      const api = useMock ? mockGetMeApi : getMeApi
      const response = await api()
      return response.data
    } catch (error) {
      localStorage.removeItem('token')
      return rejectWithValue('Session expired')
    }
  }
)
