import api from './axiosInstance'

// GET /api/logs/
export const getLogsApi = (params = {}) => api.get('/api/logs/', { params })
