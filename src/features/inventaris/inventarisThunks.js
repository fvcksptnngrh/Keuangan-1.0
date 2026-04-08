import { createAsyncThunk } from '@reduxjs/toolkit'
import {
  getInventarisApi,
  createInventarisApi,
  updateInventarisApi,
  deleteInventarisApi,
  pinjamInventarisApi,
} from '../../api/inventarisApi'
import {
  mockGetInventarisApi,
  mockCreateInventarisApi,
  mockUpdateInventarisApi,
  mockDeleteInventarisApi,
  mockPinjamInventarisApi,
} from '../../api/mockApi'

const useMock = import.meta.env.VITE_USE_MOCK === 'true'

export const fetchInventarisThunk = createAsyncThunk(
  'inventaris/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const api = useMock ? mockGetInventarisApi : () => getInventarisApi(params)
      const response = await api()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Gagal memuat inventaris')
    }
  }
)

export const pinjamInventarisThunk = createAsyncThunk(
  'inventaris/pinjam',
  async (id, { rejectWithValue }) => {
    try {
      const api = useMock ? () => mockPinjamInventarisApi(id) : () => pinjamInventarisApi(id)
      const response = await api()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Gagal meminjam barang')
    }
  }
)

export const createInventarisThunk = createAsyncThunk(
  'inventaris/create',
  async (data, { rejectWithValue }) => {
    try {
      const api = useMock ? () => mockCreateInventarisApi(data) : () => createInventarisApi(data)
      const response = await api()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Gagal menambah barang')
    }
  }
)

export const updateInventarisThunk = createAsyncThunk(
  'inventaris/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const api = useMock ? () => mockUpdateInventarisApi(id, data) : () => updateInventarisApi(id, data)
      const response = await api()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Gagal mengupdate barang')
    }
  }
)

export const deleteInventarisThunk = createAsyncThunk(
  'inventaris/delete',
  async (id, { rejectWithValue }) => {
    try {
      const api = useMock ? () => mockDeleteInventarisApi(id) : () => deleteInventarisApi(id)
      await api()
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Gagal menghapus barang')
    }
  }
)
