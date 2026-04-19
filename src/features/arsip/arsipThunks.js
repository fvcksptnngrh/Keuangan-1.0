import { createAsyncThunk } from '@reduxjs/toolkit'
import { getArsipApi, uploadArsipApi, editArsipApi, deleteArsipApi, previewArsipApi } from '../../api/arsipApi'
import {
  mockGetArsipApi,
  mockUploadArsipApi,
  mockEditArsipApi,
  mockDeleteArsipApi,
  mockDownloadArsipApi,
} from '../../api/mockApi'

const useMock = import.meta.env.VITE_USE_MOCK === 'true'

// Normalize: API format → frontend format
const normalizeDoc = (doc) => ({
  id: doc.ID,
  nama: doc.Name || '',
  noDokumen: doc.Number || '',
  tanggal: doc.CreatedDate ? doc.CreatedDate.split('T')[0] : '',
  subBagian: doc.Category || '',
  division: doc.Division || '',
  file: doc.PathFile || '',
})

export const fetchArsipThunk = createAsyncThunk(
  'arsip/fetchAll',
  async (kategori, { rejectWithValue }) => {
    try {
      if (useMock) {
        const response = await mockGetArsipApi(kategori)
        return response.data
      }

      // Real API: GET /api/archive?division=kepegawaian
      // Response: { status, message, data: { items: [...], next_cursor, has_more } }
      const response = await getArsipApi(kategori)
      const apiData = response.data.data
      if (!apiData?.items || !Array.isArray(apiData.items)) return []
      return apiData.items.map(normalizeDoc)
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

      // Real API: POST /api/archive/ (formdata)
      await uploadArsipApi(formData)
      // Re-fetch to get the full normalized list
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

      // Real API: PUT /api/archive/:id (formdata)
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

      // Real API: DELETE /api/archive/:id
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

      // Real API: fetch as blob through proxy so httpOnly cookie is sent automatically
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

export const previewArsipThunk = createAsyncThunk(
  'arsip/preview',
  async (pathFile, { rejectWithValue }) => {
    try {
      if (useMock) return null

      // JWT is in httpOnly cookie — browser sends it automatically with the iframe request.
      // No need to append token in the query string.
      if (pathFile.startsWith('http')) {
        // Strip any ?token=... left over from older backend payloads; cookie is authoritative.
        const u = new URL(pathFile)
        u.searchParams.delete('token')
        return u.pathname + (u.search ? u.search : '')
      }

      // Relative path fallback
      return `/api/archive/preview?path=${encodeURIComponent(pathFile)}`
    } catch {
      return rejectWithValue('Gagal memuat preview')
    }
  }
)
