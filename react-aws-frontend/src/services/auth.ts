// src/services/auth.ts
import { 
  LoginCredentials, 
  SignupData, 
  AuthTokens, 
  User, 
  EmailConfirmation,
  PasswordReset,
  PasswordResetConfirm 
} from '@/types/auth'
import { API_ENDPOINTS } from '@/utils/constants'
import { api } from './api'

export class AuthService {
  async login(credentials: LoginCredentials): Promise<{ tokens: AuthTokens; user: User }> {
    const response = await api.post<AuthTokens>(API_ENDPOINTS.AUTH.LOGIN, credentials)
    
    // Get user profile after successful login
    const userResponse = await api.get<User>(API_ENDPOINTS.USERS.ME)
    
    return {
      tokens: response.data!,
      user: userResponse.data!,
    }
  }

  async signup(data: SignupData): Promise<{ message: string; user_id: string }> {
    const response = await api.post(API_ENDPOINTS.AUTH.SIGNUP, data)
    return response.data!
  }

  async confirmEmail(data: EmailConfirmation): Promise<{ message: string }> {
    const response = await api.post(API_ENDPOINTS.AUTH.CONFIRM_EMAIL, data)
    return response.data!
  }

  async logout(): Promise<void> {
    await api.post(API_ENDPOINTS.AUTH.LOGOUT)
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const response = await api.post<AuthTokens>(API_ENDPOINTS.AUTH.REFRESH, {
      refresh_token: refreshToken,
    })
    return response.data!
  }

  async forgotPassword(data: PasswordReset): Promise<{ message: string }> {
    const response = await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data)
    return response.data!
  }

  async resetPassword(data: PasswordResetConfirm): Promise<{ message: string }> {
    const response = await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data)
    return response.data!
  }

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>(API_ENDPOINTS.USERS.ME)
    return response.data!
  }
}

export const authService = new AuthService()