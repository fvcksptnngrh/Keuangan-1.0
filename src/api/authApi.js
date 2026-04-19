import api from './axiosInstance'

export const loginApi = (credentials) => api.post('/api/login', credentials)
export const registerApi = (data) => api.post('/api/register', data)
export const getUsersApi = () => api.get('/api/users')
export const logoutApi = () => Promise.resolve({ data: { message: 'Logout berhasil' } })
export const getMeApi = () => api.get('/api/users')

// /api/change-password expects formdata: old_password, new_password, confirm_password
export const changePasswordApi = ({ old_password, new_password, confirm_password }) => {
  const fd = new FormData()
  fd.append('old_password', old_password)
  fd.append('new_password', new_password)
  fd.append('confirm_password', confirm_password)
  return api.post('/api/change-password', fd)
}

// /api/forgot-password expects urlencoded: email
export const forgotPasswordApi = ({ email }) => {
  const params = new URLSearchParams()
  params.append('email', email)
  return api.post('/api/forgot-password', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

// /api/reset-password expects formdata: token, new_password, confirm_new_password
export const resetPasswordApi = ({ token, new_password, confirm_new_password }) => {
  const fd = new FormData()
  fd.append('token', token)
  fd.append('new_password', new_password)
  fd.append('confirm_new_password', confirm_new_password)
  return api.post('/api/reset-password', fd)
}
