// src/hooks/useAuth.ts
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import { 
  login, 
  signup, 
  logout, 
  getCurrentUser, 
  clearError 
} from '@/store/authSlice'
import { LoginCredentials, SignupData } from '@/types/auth'

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const { user, tokens, isAuthenticated, isLoading, error } = useAppSelector(
    (state) => state.auth
  )

  const signIn = async (credentials: LoginCredentials) => {
    return dispatch(login(credentials))
  }

  const signUp = async (data: SignupData) => {
    return dispatch(signup(data))
  }

  const signOut = async () => {
    return dispatch(logout())
  }

  const refreshUserData = async () => {
    if (isAuthenticated) {
      return dispatch(getCurrentUser())
    }
  }

  const clearAuthError = () => {
    dispatch(clearError())
  }

  // Auto-fetch user data on mount if authenticated
  useEffect(() => {
    if (isAuthenticated && !user) {
      refreshUserData()
    }
  }, [isAuthenticated, user])

  return {
    user,
    tokens,
    isAuthenticated,
    isLoading,
    error,
    signIn,
    signUp,
    signOut,
    refreshUserData,
    clearAuthError,
  }
}