// src/hooks/useFileUpload.ts
import { useState, useCallback } from 'react'
import { useAppDispatch } from '@/store'
import { uploadAvatar } from '@/store/userSlice'
import { addToast } from '@/store/uiSlice'
import { VALIDATION_RULES } from '@/utils/constants'
import { isImageFile, formatBytes } from '@/utils/helpers'

interface UseFileUploadOptions {
  maxSize?: number
  allowedTypes?: string[]
  onSuccess?: (response: any) => void
  onError?: (error: string) => void
}

export const useFileUpload = (options?: UseFileUploadOptions) => {
  const dispatch = useAppDispatch()
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    maxSize = VALIDATION_RULES.FILE_UPLOAD.MAX_SIZE,
    allowedTypes = VALIDATION_RULES.FILE_UPLOAD.ALLOWED_TYPES,
    onSuccess,
    onError,
  } = options || {}

  const validateFile = useCallback(
    (file: File): string | null => {
      if (file.size > maxSize) {
        return `File size exceeds ${formatBytes(maxSize)} limit`
      }

      if (!allowedTypes.includes(file.type)) {
        return `File type ${file.type} is not allowed`
      }

      return null
    },
    [maxSize, allowedTypes]
  )

  const uploadFile = useCallback(
    async (file: File) => {
      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        if (onError) onError(validationError)
        dispatch(addToast({
          type: 'error',
          title: 'Upload Error',
          message: validationError,
        }))
        return
      }

      setIsUploading(true)
      setError(null)
      setUploadProgress(0)

      try {
        const result = await dispatch(uploadAvatar(file)).unwrap()
        
        setUploadProgress(100)
        setIsUploading(false)
        
        if (onSuccess) onSuccess(result)
        dispatch(addToast({
          type: 'success',
          title: 'Upload Successful',
          message: 'File uploaded successfully',
        }))
        
        return result
      } catch (error: any) {
        const errorMessage = error || 'Upload failed'
        setError(errorMessage)
        setIsUploading(false)
        setUploadProgress(0)
        
        if (onError) onError(errorMessage)
        dispatch(addToast({
          type: 'error',
          title: 'Upload Failed',
          message: errorMessage,
        }))
        
        throw error
      }
    },
    [dispatch, validateFile, onSuccess, onError]
  )

  const reset = useCallback(() => {
    setUploadProgress(0)
    setIsUploading(false)
    setError(null)
  }, [])

  return {
    uploadFile,
    uploadProgress,
    isUploading,
    error,
    reset,
    validateFile,
  }
}