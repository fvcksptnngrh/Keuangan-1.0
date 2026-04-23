import { createAsyncThunk } from '@reduxjs/toolkit'
import { loginApi, registerApi, logoutApi, changePasswordApi, forgotPasswordApi, resetPasswordApi, getMeApi } from '../../api/authApi'
import { mockLoginApi, mockLogoutApi, mockGetMeApi } from '../../api/mockApi'

const useMock = import.meta.env.VITE_USE_MOCK === 'true'

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return {}
  }
}

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      if (useMock) {
        const response = await mockLoginApi(credentials)
        const { token, user } = response.data
        return { token, user }
      }

      // Real API: POST /api/login { nip, password }
      // Backend returns token in response body and/or sets as httpOnly cookie.
      // If response.data.data only contains { token }, decode the JWT payload as fallback.
      const response = await loginApi(credentials)
      const apiData = response.data.data || {}
      const token = apiData.token || null
      const jwt = token ? parseJwt(token) : {}
      const user = {
        id: apiData.id ?? jwt.id,
        nip: apiData.nip ?? jwt.nip,
        nama: apiData.name ?? jwt.name,
        role: apiData.role ?? jwt.role,
      }
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

export const logoutThunk = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
  try {
    const api = useMock ? mockLogoutApi : logoutApi
    await api()
  } catch {
    // ignore — always clear local state
  }
  return null
})

export const changePasswordThunk = createAsyncThunk(
  'auth/changePassword',
  async ({ oldPassword, newPassword, confirmPassword }, { rejectWithValue }) => {
    try {
      if (useMock) return { message: 'Password berhasil diubah' }
      const response = await changePasswordApi({
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      })
      return { message: response.data.message || 'Password berhasil diubah' }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Gagal mengubah password'
      )
    }
  }
)

export const resetPasswordThunk = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, newPassword, confirmNewPassword }, { rejectWithValue }) => {
    try {
      if (useMock) return { message: 'Password berhasil direset' }
      const response = await resetPasswordApi({
        token,
        new_password: newPassword,
        confirm_new_password: confirmNewPassword,
      })
      return { message: response.data.message || 'Password berhasil direset' }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Gagal mereset password. Link mungkin sudah kedaluwarsa.'
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
      const response = await getMeApi()
      const userData = response.data.data || response.data
      return userData
    } catch (error) {
      return rejectWithValue('Session expired')
    }
  }
)
