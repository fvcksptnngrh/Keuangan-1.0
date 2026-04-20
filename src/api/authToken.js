const STORAGE_KEY = 'persist:auth'
const COOKIE_NAME = 'token'

const readFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.token) return null
    const token = JSON.parse(parsed.token)
    return typeof token === 'string' && token ? token : null
  } catch {
    return null
  }
}

const writeCookie = (token) => {
  if (typeof document === 'undefined') return
  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${COOKIE_NAME}=${token}; path=/; SameSite=Lax${secure}`
}

const deleteCookie = () => {
  if (typeof document === 'undefined') return
  document.cookie = `${COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
}

let currentToken = readFromStorage()
if (currentToken) writeCookie(currentToken)

export const getAuthToken = () => currentToken

export const setAuthToken = (token) => {
  currentToken = token || null
  if (currentToken) writeCookie(currentToken)
  else deleteCookie()
}

export const clearAuthToken = () => {
  currentToken = null
  deleteCookie()
}
