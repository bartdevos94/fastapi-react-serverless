// src/components/ui/Toast.tsx
import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { useAppSelector } from '@/store'
import { useToast } from '@/hooks/useToast'
import { ToastMessage } from '@/types/common'
import { cn } from '@/utils/helpers'
import { UI_CONFIG } from '@/utils/constants'

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const toastStyles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
}

interface ToastItemProps {
  toast: ToastMessage
  onRemove: (id: string) => void
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const Icon = toastIcons[toast.type]

  useEffect(() => {
    const duration = toast.duration || UI_CONFIG.TOAST.DEFAULT_DURATION
    const timer = setTimeout(() => onRemove(toast.id), duration)
    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onRemove])

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={cn(
        'pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border shadow-lg',
        toastStyles[toast.type]
      )}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className="h-5 w-5" />
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-medium">{toast.title}</p>
            {toast.message && (
              <p className="mt-1 text-sm opacity-90">{toast.message}</p>
            )}
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              className="inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
              onClick={() => onRemove(toast.id)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export const ToastContainer: React.FC = () => {
  const toasts = useAppSelector((state) => state.ui.toasts)
  const { hideToast } = useToast()

  return (
    <div className="pointer-events-none fixed bottom-0 right-0 z-50 p-6 sm:p-6">
      <div className="flex flex-col items-end space-y-4">
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem
              key={toast.id}
              toast={toast}
              onRemove={hideToast}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}