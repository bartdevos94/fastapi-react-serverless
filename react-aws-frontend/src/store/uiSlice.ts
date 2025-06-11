// src/store/uiSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ToastMessage } from '@/types/common'

interface UIState {
  theme: 'light' | 'dark' | 'system'
  sidebarOpen: boolean
  loading: {
    global: boolean
    overlay: boolean
  }
  toasts: ToastMessage[]
  modals: {
    [key: string]: boolean
  }
}

const initialState: UIState = {
  theme: 'system',
  sidebarOpen: false,
  loading: {
    global: false,
    overlay: false,
  },
  toasts: [],
  modals: {},
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload
    },
    setOverlayLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.overlay = action.payload
    },
    addToast: (state, action: PayloadAction<Omit<ToastMessage, 'id'>>) => {
      const id = Date.now().toString()
      state.toasts.push({ ...action.payload, id })
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload)
    },
    clearToasts: (state) => {
      state.toasts = []
    },
    openModal: (state, action: PayloadAction<string>) => {
      state.modals[action.payload] = true
    },
    closeModal: (state, action: PayloadAction<string>) => {
      state.modals[action.payload] = false
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(key => {
        state.modals[key] = false
      })
    },
  },
})

export const {
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  setGlobalLoading,
  setOverlayLoading,
  addToast,
  removeToast,
  clearToasts,
  openModal,
  closeModal,
  closeAllModals,
} = uiSlice.actions

export default uiSlice.reducer