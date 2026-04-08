import { createAsyncThunk } from '@reduxjs/toolkit'
import { getArsipApi, uploadArsipApi, deleteArsipApi, downloadArsipApi } from '../../api/arsipApi'
import {
  mockGetArsipApi,
  mockUploadArsipApi,
  mockDeleteArsipApi,
  mockDownloadArsipApi,
} from '../../api/mockApi'

const useMock = import.meta.env.VITE_USE_MOCK === 'true'

export const fetchArsipThunk = createAsyncThunk(
  'arsip/fetchAll',
  async (kategori, { rejectWithValue }) => {
    try {
      const api = useMock
        ? () => mockGetArsipApi(kategori)
        : () => getArsipApi(kategori)
      const response = await api()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Gagal memuat arsip')
    }
  }
)

export const uploadArsipThunk = createAsyncThunk(
  'arsip/upload',
  async ({ kategori, formData }, { rejectWithValue }) => {
    try {
      const api = useMock
        ? () => mockUploadArsipApi(kategori, formData)
        : () => uploadArsipApi(kategori, formData)
      const response = await api()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Gagal mengunggah arsip')
    }
  }
)

export const deleteArsipThunk = createAsyncThunk(
  'arsip/delete',
  async ({ id, kategori }, { rejectWithValue }) => {
    try {
      const api = useMock
        ? () => mockDeleteArsipApi(id)
        : () => deleteArsipApi(id)
      await api()
      return { id, kategori }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Gagal menghapus arsip')
    }
  }
)

export const downloadArsipThunk = createAsyncThunk(
  'arsip/download',
  async ({ id, fileName }, { rejectWithValue }) => {
    try {
      const api = useMock
        ? () => mockDownloadArsipApi(id)
        : () => downloadArsipApi(id)
      const response = await api()
      const blob = response.data
      const url = window.URL.createObjectURL(blob instanceof Blob ? blob : new Blob([blob]))
      const link = document.createElement('a')
      link.href = url
      link.download = fileName || 'dokumen.pdf'
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      return { id }
    } catch (error) {
      return rejectWithValue('Gagal mengunduh file')
    }
  }
)
