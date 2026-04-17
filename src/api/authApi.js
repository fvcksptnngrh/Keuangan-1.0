import api from './axiosInstance'

export const loginApi = (credentials) => api.post('/api/login', credentials)
export const registerApi = (data) => api.post('/api/register', data)
export const getUsersApi = () => api.get('/api/users')
export const logoutApi = () => Promise.resolve({ data: { message: 'Logout berhasil' } })
export const getMeApi = () => api.get('/api/users')
