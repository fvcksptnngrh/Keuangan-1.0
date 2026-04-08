import api from './axiosInstance'

export const getInventarisApi = (params) => api.get('/inventaris', { params })
export const getInventarisByIdApi = (id) => api.get(`/inventaris/${id}`)
export const createInventarisApi = (data) => api.post('/inventaris', data)
export const updateInventarisApi = (id, data) => api.put(`/inventaris/${id}`, data)
export const deleteInventarisApi = (id) => api.delete(`/inventaris/${id}`)
export const pinjamInventarisApi = (id) => api.post(`/inventaris/${id}/pinjam`)
export const riwayatPeminjamanApi = (params) => api.get('/inventaris/riwayat', { params })
