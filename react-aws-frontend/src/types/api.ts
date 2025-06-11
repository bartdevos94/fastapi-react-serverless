// src/types/api.ts
export interface ApiResponse<T = any> {
  data?: T
  message?: string
  error?: string
  success: boolean
}

export interface ApiError {
  detail: string | string[]
  type?: string
  status_code: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  per_page: number
  pages: number
}

export interface FileUploadResponse {
  file_key: string
  file_size: number
  content_type?: string
  upload_url?: string
}

export interface PresignedUrlRequest {
  file_key: string
  expiration?: number
  operation?: 'get_object' | 'put_object'
}

export interface PresignedUrlResponse {
  url: string
  expires_in: number
}