// src/types/auth.ts
export interface User {
  user_id: string
  email: string
  first_name?: string
  last_name?: string
  phone_number?: string
  is_active: boolean
  email_verified: boolean
  avatar_key?: string
  created_at: string
  updated_at: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData {
  email: string
  password: string
  confirm_password: string
  first_name?: string
  last_name?: string
  phone_number?: string
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

export interface AuthState {
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface EmailConfirmation {
  email: string
  confirmation_code: string
}

export interface PasswordReset {
  email: string
}

export interface PasswordResetConfirm {
  email: string
  confirmation_code: string
  new_password: string
  confirm_password: string
}