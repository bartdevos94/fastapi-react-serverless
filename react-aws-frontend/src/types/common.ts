// src/types/common.ts
export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

export interface LoadingState {
  isLoading: boolean
  error: string | null
}

export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'tel' | 'file'
  placeholder?: string
  required?: boolean
  validation?: any
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

export interface InputProps {
  label?: string
  error?: string
  required?: boolean
  className?: string
}

// Environment variables type
export interface EnvironmentConfig {
  VITE_API_URL: string
  VITE_AWS_REGION: string
  VITE_COGNITO_USER_POOL_ID: string
  VITE_COGNITO_CLIENT_ID: string
  VITE_S3_BUCKET_NAME: string
  VITE_CLOUDFRONT_URL?: string
  VITE_ENVIRONMENT: 'development' | 'staging' | 'production'
}