import { createAsyncThunk } from '@reduxjs/toolkit'
import { loginApi, registerApi, logoutApi, changePasswordApi, forgotPasswordApi } from '../../api/authApi'
import { mockLoginApi, mockLogoutApi, mockGetMeApi } from '../../api/mockApi'

const useMock = import.meta.env.VITE_USE_MOCK === 'true'

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      if (useMock) {
        const response = await mockLoginApi(credentials)
        const { token, user } = response.data
        localStorage.setItem('token', token)
        return { token, user }
      }

      // Real API: POST /api/login { nip, password }
      // Response: { status, message, data: { token, id, nip, name, role } }
      const response = await loginApi(credentials)
      const apiData = response.data.data
      const token = apiData.token
      const user = {
        id: apiData.id,
        nip: apiData.nip,
        nama: apiData.name,
        role: apiData.role,
      }
      localStorage.setItem('token', token)
      return { token, user }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'NIP atau password salah'
      )
    }
  }
)

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (data, { rejectWithValue }) => {
    try {
      if (useMock) {
        // Mock: simulate success
        return { message: 'Pendaftaran berhasil' }
      }

      // Real API: POST /api/register { nip, name, email, password, role }
      // Response: { status, message, data: null }
      const response = await registerApi(data)
      return { message: response.data.message }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Pendaftaran gagal'
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

export const changePasswordThunk = createAsyncThunk(
  'auth/changePassword',
  async ({ oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      if (useMock) return { message: 'Password berhasil diubah' }
      const response = await changePasswordApi({
        old_password: oldPassword,
        new_password: newPassword,
      })
      return { message: response.data.message || 'Password berhasil diubah' }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Gagal mengubah password'
      )
    }
  }
)

export const forgotPasswordThunk = createAsyncThunk(
  'auth/forgotPassword',
  async ({ email }, { rejectWithValue }) => {
    try {
      if (useMock) return { message: 'Link reset password telah dikirim' }
      const response = await forgotPasswordApi({ email })
      return { message: response.data.message || 'Link reset password telah dikirim ke email Anda' }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Gagal mengirim link reset password'
      )
    }
  }
)

export const getMeThunk = createAsyncThunk(
  'auth/getMe',
  async (_, { rejectWithValue }) => {
    try {
      if (useMock) {
        const response = await mockGetMeApi()
        return response.data
      }
      // No dedicated /me endpoint in API — token contains user info via JWT
      // We'll rely on the login data stored in Redux
      return rejectWithValue('No getMe endpoint')
    } catch (error) {
      localStorage.removeItem('token')
      return rejectWithValue('Session expired')
    }
  }
)
