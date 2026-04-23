import api from './axiosInstance'

// GET /api/archive?division=kepegawaian&keyword=&category=&start_date=&end_date=&limit=
export const getArsipApi = (division, params = {}) =>
  api.get('/api/archive', { params: { division, ...params } })

// GET /api/archive/:id
export const getArsipByIdApi = (id) => api.get(`/api/archive/${id}`)

// GET /api/archive/newest
export const getArsipNewestApi = () => api.get('/api/archive/newest')

// GET /api/archive/count
export const getArsipCountApi = () => api.get('/api/archive/count')

// POST /api/archive/ (formdata: name, number, category, created_date, file, division)
export const uploadArsipApi = (formData) =>
  api.post('/api/archive/', formData)

// PUT /api/archive/:id (formdata: name, number, created_date, division)
export const editArsipApi = (id, formData) =>
  api.put(`/api/archive/${id}`, formData)

// DELETE /api/archive/:id
export const deleteArsipApi = (id) => api.delete(`/api/archive/${id}`)

// GET /api/archive/preview?path=uploads/xxx.pdf
export const previewArsipApi = (path) =>
  api.get('/api/archive/preview', {
    params: { path },
    responseType: 'blob',
  })
