import { configureStore } from '@reduxjs/toolkit'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from '../features/auth/authSlice'
import inventarisReducer from '../features/inventaris/inventarisSlice'
import arsipReducer from '../features/arsip/arsipSlice'
import logReducer from '../features/log/logSlice'
import peminjamanReducer from '../features/peminjaman/peminjamanSlice'

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['token', 'user', 'role', 'isAuthenticated'],
}

export const store = configureStore({
  reducer: {
    auth: persistReducer(authPersistConfig, authReducer),
    inventaris: inventarisReducer,
    arsip: arsipReducer,
    log: logReducer,
    peminjaman: peminjamanReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)
