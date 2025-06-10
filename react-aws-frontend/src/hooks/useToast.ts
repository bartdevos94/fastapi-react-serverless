// src/hooks/useToast.ts
import { useCallback } from 'react'
import { useAppDispatch } from '@/store'
import { addToast, removeToast } from '@/store/uiSlice'
import { ToastMessage } from '@/types/common'

export const useToast = () => {
  const dispatch = useAppDispatch()

  const showToast = useCallback(
    (toast: Omit<ToastMessage, 'id'>) => {
      dispatch(addToast(toast))
    },
    [dispatch]
  )

  const hideToast = useCallback(
    (id: string) => {
      dispatch(removeToast(id))
    },
    [dispatch]
  )

  const success = useCallback(
    (title: string, message?: string) => {
      showToast({ type: 'success', title, message })
    },
    [showToast]
  )

  const error = useCallback(
    (title: string, message?: string) => {
      showToast({ type: 'error', title, message })
    },
    [showToast]
  )

  const warning = useCallback(
    (title: string, message?: string) => {
      showToast({ type: 'warning', title, message })
    },
    [showToast]
  )

  const info = useCallback(
    (title: string, message?: string) => {
      showToast({ type: 'info', title, message })
    },
    [showToast]
  )

  return {
    showToast,
    hideToast,
    success,
    error,
    warning,
    info,
  }
}