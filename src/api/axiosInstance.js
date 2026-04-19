import axios from 'axios'

// withCredentials: true makes the browser send httpOnly cookies (including JWT)
// with every request automatically. Auth header is NOT needed.
const api = axios.create({
  baseURL: '',
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

const PUBLIC_PATHS = ['/login', '/reset-password', '/403', '/500']

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('persist:auth')
      const path = window.location.pathname
      if (!PUBLIC_PATHS.includes(path)) {
        window.location.replace('/login')
      }
    }
    return Promise.reject(error)
  }
)

export default api
