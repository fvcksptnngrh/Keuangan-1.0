import api from './axiosInstance'

export const getArsipApi = (kategori, params) => api.get(`/arsip/${kategori}`, { params })
export const getArsipByIdApi = (id) => api.get(`/arsip/${id}`)
export const uploadArsipApi = (kategori, formData) =>
  api.post(`/arsip/${kategori}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
export const deleteArsipApi = (id) => api.delete(`/arsip/${id}`)
export const downloadArsipApi = (id) =>
  api.get(`/arsip/${id}/download`, { responseType: 'blob' })
export const searchArsipApi = (kategori, query) =>
  api.get(`/arsip/${kategori}/search`, { params: { q: query } })
