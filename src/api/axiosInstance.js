import axios from 'axios'

const api = axios.create({
  baseURL: '',
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

const PUBLIC_PATHS = ['/login', '/reset-password', '/403', '/500']

api.interceptors.request.use((config) => {
  // For FormData, remove explicit Content-Type so browser/axios sets multipart with boundary
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const path = window.location.pathname
      if (!PUBLIC_PATHS.includes(path)) {
        window.location.replace('/login')
      }
    }
    return Promise.reject(error)
  }
)

export default api
