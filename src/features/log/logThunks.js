import { createAsyncThunk } from '@reduxjs/toolkit'
import { getLogsApi } from '../../api/logsApi'

const pickFirst = (obj, keys) => {
  for (const k of keys) {
    if (obj && obj[k] !== undefined && obj[k] !== null && obj[k] !== '') return obj[k]
  }
  return undefined
}

const formatWaktu = (value) => {
  if (!value) return ''
  const d = new Date(value)
  if (isNaN(d.getTime())) return String(value)
  return d.toLocaleString('sv-SE').replace('T', ' ').slice(0, 19)
}

const normalizeLog = (raw) => ({
  id: pickFirst(raw, ['ID', 'id', 'LogID', 'log_id']) ?? Math.random(),
  userId: pickFirst(raw, ['UserID', 'user_id', 'userId']),
  nama: pickFirst(raw, ['Name', 'name', 'UserName', 'user_name', 'nama']) || '-',
  aksi: pickFirst(raw, ['Action', 'action', 'aksi']) || '-',
  target: pickFirst(raw, ['Target', 'target', 'Detail', 'detail']) || '',
  waktu: formatWaktu(pickFirst(raw, ['CreatedAt', 'created_at', 'Waktu', 'waktu', 'timestamp'])),
})

export const fetchLogsThunk = createAsyncThunk(
  'log/fetchAll',
  async (params = {}, { rejectWithValue, getState }) => {
    try {
      // Check cache: if data exists and is < 10 min old, skip network
      const state = getState()
      const cached = state.log.logs
      const lastFetch = state.log.lastFetch
      const now = Date.now()
      const CACHE_TTL = 10 * 60 * 1000 // 10 minutes
      if (cached?.length > 0 && lastFetch && (now - lastFetch) < CACHE_TTL) {
        return cached
      }

      const response = await getLogsApi(params)
      const payload = response.data?.data ?? response.data
      const items = Array.isArray(payload)
        ? payload
        : payload?.items || payload?.logs || []
      return items.map(normalizeLog)
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Gagal memuat log')
    }
  }
)
