// src/hooks/useApi.ts
import { useState, useCallback } from 'react'
import { api } from '@/services/api'
import { ApiResponse, ApiError } from '@/types/api'

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: ApiError | null
}

interface UseApiOptions {
  onSuccess?: (data: any) => void
  onError?: (error: ApiError) => void
}

export const useApi = <T = any>(options?: UseApiOptions) => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(
    async (apiCall: () => Promise<ApiResponse<T>>) => {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      try {
        const response = await apiCall()
        setState({
          data: response.data || null,
          loading: false,
          error: null,
        })
        
        if (options?.onSuccess && response.data) {
          options.onSuccess(response.data)
        }
        
        return response
      } catch (error) {
        const apiError = error as ApiError
        setState({
          data: null,
          loading: false,
          error: apiError,
        })
        
        if (options?.onError) {
          options.onError(apiError)
        }
        
        throw error
      }
    },
    [options]
  )

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    })
  }, [])

  return {
    ...state,
    execute,
    reset,
  }
}