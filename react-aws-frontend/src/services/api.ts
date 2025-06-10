// src/services/api.ts
import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import { ApiResponse, ApiError } from '@/types/api'
import { STORAGE_KEYS } from '@/utils/constants'
import { storage } from './storage'

class ApiService {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = storage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor to handle errors and token refresh
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const original = error.config

        if (error.response?.status === 401 && original && !original._retry) {
          original._retry = true

          try {
            const refreshToken = storage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
            if (refreshToken) {
              const response = await this.refreshToken(refreshToken)
              const { access_token } = response.data
              
              storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token)
              
              if (original.headers) {
                original.headers.Authorization = `Bearer ${access_token}`
              }
              
              return this.client(original)
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            storage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
            storage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
            storage.removeItem(STORAGE_KEYS.USER_DATA)
            window.location.href = '/login'
          }
        }

        return Promise.reject(this.handleError(error))
      }
    )
  }

  private handleError(error: AxiosError): ApiError {
    if (error.response) {
      const { status, data } = error.response
      return {
        detail: (data as any)?.detail || 'An error occurred',
        status_code: status,
        type: (data as any)?.type || 'APIError',
      }
    }

    if (error.request) {
      return {
        detail: 'Network error - please check your connection',
        status_code: 0,
        type: 'NetworkError',
      }
    }

    return {
      detail: error.message || 'An unexpected error occurred',
      status_code: 500,
      type: 'UnknownError',
    }
  }

  private async refreshToken(refreshToken: string) {
    return this.client.post('/api/v1/auth/refresh', {
      refresh_token: refreshToken,
    })
  }

  // HTTP Methods
  async get<T = any>(url: string, config?: any): Promise<ApiResponse<T>> {
    const response = await this.client.get(url, config)
    return { data: response.data, success: true }
  }

  async post<T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    const response = await this.client.post(url, data, config)
    return { data: response.data, success: true }
  }

  async put<T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    const response = await this.client.put(url, data, config)
    return { data: response.data, success: true }
  }

  async delete<T = any>(url: string, config?: any): Promise<ApiResponse<T>> {
    const response = await this.client.delete(url, config)
    return { data: response.data, success: true }
  }

  async uploadFile<T = any>(url: string, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<T>> {
    const formData = new FormData()
    formData.append('file', file)

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent: any) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(progress)
        }
      },
    }

    const response = await this.client.post(url, formData, config)
    return { data: response.data, success: true }
  }
}

export const api = new ApiService()