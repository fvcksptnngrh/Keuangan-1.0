import { createAsyncThunk } from '@reduxjs/toolkit'
import { getArsipApi, uploadArsipApi, editArsipApi, deleteArsipApi, previewArsipApi, getArsipNewestApi, getArsipCountApi } from '../../api/arsipApi'
import {
  mockGetArsipApi,
  mockUploadArsipApi,
  mockEditArsipApi,
  mockDeleteArsipApi,
  mockDownloadArsipApi,
} from '../../api/mockApi'

const useMock = import.meta.env.VITE_USE_MOCK === 'true'

// Backend may return PascalCase or lowercase keys — accept both.
const pick = (doc, ...keys) => {
  for (const k of keys) {
    if (doc[k] !== undefined && doc[k] !== null) return doc[k]
  }
  return ''
}

const normalizeDoc = (doc) => {
  const createdDate = pick(doc, 'CreatedDate', 'created_date', 'createdDate')
  return {
    id: pick(doc, 'ID', 'id'),
    nama: pick(doc, 'Name', 'name') || '',
    noDokumen: pick(doc, 'Number', 'number') || '',
    tanggal: typeof createdDate === 'string' && createdDate.includes('T')
      ? createdDate.split('T')[0]
      : createdDate || '',
    subBagian: pick(doc, 'Category', 'category') || '',
    division: pick(doc, 'Division', 'division') || '',
    file: pick(doc, 'PathFile', 'path_file', 'pathFile') || '',
  }
}

/**
 * fetchArsipThunk
 * arg: {
 *   kategori,
 *   keyword?, category?, startDate?, endDate?,
 *   direction: 'first' | 'next' | 'prev',
 * }
 * Uses cursor stored in slice.byKategori[kategori].cursorByPage to walk pages.
 */
export const fetchArsipThunk = createAsyncThunk(
  'arsip/fetchAll',
  async (arg, { rejectWithValue, getState }) => {
    try {
      const {
        kategori,
        keyword = '',
        category = '',
        startDate = '',
        endDate = '',
        direction = 'first',
      } = typeof arg === 'string' ? { kategori: arg } : arg

      if (useMock) {
        const response = await mockGetArsipApi(kategori)
        return {
          kategori,
          items: response.data || [],
          nextCursor: null,
          hasMore: false,
          page: 1,
          cursorUsed: '',
        }
      }

      const branch = getState().arsip.byKategori[kategori]
      let targetPage = 1
      let cursor = ''

      if (direction === 'next' && branch?.nextCursor != null) {
        targetPage = (branch.page || 1) + 1
        cursor = String(branch.nextCursor)
      } else if (direction === 'prev' && (branch?.page || 1) > 1) {
        targetPage = branch.page - 1
        cursor = branch.cursorByPage[targetPage] ?? ''
      } else {
        targetPage = 1
        cursor = ''
      }

      const params = {
        limit: 10,
        cursor,
      }
      if (keyword) params.keyword = keyword
      if (category) params.category = category
      if (startDate) params.start_date = startDate
      if (endDate) params.end_date = endDate

      const response = await getArsipApi(kategori, params)
      const apiData = response.data?.data
      const rawItems = Array.isArray(apiData) ? apiData : (apiData?.items || [])
      const items = rawItems.map(normalizeDoc)
      const nextCursor = Array.isArray(apiData) ? null : (apiData?.next_cursor ?? null)
      const hasMore = Array.isArray(apiData) ? false : Boolean(apiData?.has_more)

      return {
        kategori,
        items,
        nextCursor,
        hasMore,
        page: targetPage,
        cursorUsed: cursor,
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Gagal memuat arsip')
    }
  }
)

export const uploadArsipThunk = createAsyncThunk(
  'arsip/upload',
  async ({ kategori, formData }, { rejectWithValue }) => {
    try {
      if (useMock) {
        const response = await mockUploadArsipApi(kategori, formData)
        return response.data
      }
      await uploadArsipApi(formData)
      return { refetch: true }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Gagal mengunggah arsip')
    }
  }
)

export const editArsipThunk = createAsyncThunk(
  'arsip/edit',
  async ({ id, kategori, formData }, { rejectWithValue }) => {
    try {
      if (useMock) {
        const response = await mockEditArsipApi(id, formData)
        return { ...response.data, kategori }
      }
      await editArsipApi(id, formData)
      return { refetch: true, kategori }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Gagal mengedit arsip')
    }
  }
)

export const deleteArsipThunk = createAsyncThunk(
  'arsip/delete',
  async ({ id, kategori }, { rejectWithValue }) => {
    try {
      if (useMock) {
        await mockDeleteArsipApi(id)
        return { id, kategori }
      }
      await deleteArsipApi(id)
      return { id, kategori }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Gagal menghapus arsip')
    }
  }
)

export const downloadArsipThunk = createAsyncThunk(
  'arsip/download',
  async ({ fileUrl, fileName }, { rejectWithValue }) => {
    try {
      if (useMock) {
        const response = await mockDownloadArsipApi()
        const blob = response.data
        const url = window.URL.createObjectURL(blob instanceof Blob ? blob : new Blob([blob]))
        const link = document.createElement('a')
        link.href = url
        link.download = fileName || 'dokumen.pdf'
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
        return { fileName }
      }

      let url = fileUrl
      if (url.startsWith('http')) {
        const u = new URL(url)
        u.searchParams.delete('token')
        url = u.pathname + (u.search ? u.search : '')
      }
      const axios = (await import('../../api/axiosInstance')).default
      const response = await axios.get(url, { responseType: 'blob' })
      const blobUrl = window.URL.createObjectURL(response.data)
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = fileName || 'dokumen.pdf'
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(blobUrl)
      return { fileName }
    } catch (error) {
      return rejectWithValue('Gagal mengunduh file')
    }
  }
)

export const fetchNewestArsipThunk = createAsyncThunk(
  'arsip/fetchNewest',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getArsipNewestApi()
      const items = response.data?.data
      if (!Array.isArray(items)) return []
      return items.map((doc) => ({
        id: doc.id,
        nama: doc.name || '',
        noDokumen: doc.number || '',
        tanggal: doc.created_date || '',
        subBagian: doc.category || '',
        division: doc.division || '',
      }))
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Gagal memuat arsip terbaru')
    }
  }
)

export const fetchArsipCountThunk = createAsyncThunk(
  'arsip/fetchCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getArsipCountApi()
      const d = response.data?.data
      return {
        totalDokumen: d?.total_documents ?? 0,
        totalKepegawaian: d?.total_kepegawaian ?? 0,
        totalKeuangan: d?.total_keuangan ?? 0,
        totalUmum: d?.total_umum ?? 0,
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Gagal memuat total dokumen')
    }
  }
)

export const previewArsipThunk = createAsyncThunk(
  'arsip/preview',
  async (pathFile, { rejectWithValue }) => {
    try {
      if (useMock) return null
      if (!pathFile) return rejectWithValue('File path tidak tersedia')

      let url = pathFile
      if (url.startsWith('http')) {
        const u = new URL(url)
        url = u.pathname + u.search
      }

      const axios = (await import('../../api/axiosInstance')).default
      const response = await axios.get(url, { responseType: 'blob' })
      return URL.createObjectURL(response.data)
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Gagal memuat preview')
    }
  }
)
