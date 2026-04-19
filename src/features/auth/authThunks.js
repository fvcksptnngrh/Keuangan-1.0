import { createAsyncThunk } from '@reduxjs/toolkit'
import { loginApi, registerApi, logoutApi, changePasswordApi, forgotPasswordApi, resetPasswordApi } from '../../api/authApi'
import { mockLoginApi, mockLogoutApi, mockGetMeApi } from '../../api/mockApi'

const useMock = import.meta.env.VITE_USE_MOCK === 'true'

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
      // JWT is set by backend as httpOnly cookie — no token handling on frontend
      const response = await loginApi(credentials)
      const apiData = response.data.data || {}
      const user = {
        id: apiData.id,
        nip: apiData.nip,
        nama: apiData.name,
        role: apiData.role,
      }
      return { token: null, user }
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
  } catch {
    // ignore — backend should clear the cookie, but we still want to clear local state
  }
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
      // No dedicated /me endpoint in API — rely on the login data stored in Redux
      return rejectWithValue('No getMe endpoint')
    } catch (error) {
      return rejectWithValue('Session expired')
    }
  }
)
