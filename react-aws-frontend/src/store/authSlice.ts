// src/store/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { AuthState, LoginCredentials, SignupData, User, AuthTokens } from '@/types/auth'
import { authService } from '@/services/auth'
import { storage } from '@/services/storage'
import { STORAGE_KEYS } from '@/utils/constants'

const initialState: AuthState = {
  user: storage.getUserData<User>(),
  tokens: storage.getAccessToken() && storage.getRefreshToken() ? {
    access_token: storage.getAccessToken()!,
    refresh_token: storage.getRefreshToken()!,
    token_type: 'bearer',
    expires_in: 3600,
  } : null,
  isAuthenticated: !!storage.getAccessToken(),
  isLoading: false,
  error: null,
}

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const { tokens, user } = await authService.login(credentials)
      
      // Store tokens and user data
      storage.setTokens(tokens.access_token, tokens.refresh_token)
      storage.setUserData(user)
      
      return { tokens, user }
    } catch (error: any) {
      return rejectWithValue(error.detail || 'Login failed')
    }
  }
)

export const signup = createAsyncThunk(
  'auth/signup',
  async (data: SignupData, { rejectWithValue }) => {
    try {
      const result = await authService.signup(data)
      return result
    } catch (error: any) {
      return rejectWithValue(error.detail || 'Signup failed')
    }
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout()
      storage.clearAll()
    } catch (error: any) {
      // Clear local storage even if API call fails
      storage.clearAll()
      return rejectWithValue(error.detail || 'Logout failed')
    }
  }
)

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: AuthState }
      const refreshTokenValue = auth.tokens?.refresh_token
      
      if (!refreshTokenValue) {
        throw new Error('No refresh token available')
      }
      
      const tokens = await authService.refreshToken(refreshTokenValue)
      storage.setTokens(tokens.access_token, tokens.refresh_token)
      
      return tokens
    } catch (error: any) {
      storage.clearAll()
      return rejectWithValue(error.detail || 'Token refresh failed')
    }
  }
)

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getCurrentUser()
      storage.setUserData(user)
      return user
    } catch (error: any) {
      return rejectWithValue(error.detail || 'Failed to get user data')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      storage.setUserData(action.payload)
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
        storage.setUserData(state.user)
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.tokens = action.payload.tokens
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.user = null
        state.tokens = null
        state.error = action.payload as string
      })
      
      // Signup
      .addCase(signup.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(signup.fulfilled, (state) => {
        state.isLoading = false
        state.error = null
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false
        state.user = null
        state.tokens = null
        state.error = null
      })
      
      // Refresh Token
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.tokens = action.payload
      })
      .addCase(refreshToken.rejected, (state) => {
        state.isAuthenticated = false
        state.user = null
        state.tokens = null
      })
      
      // Get Current User
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload
      })
  },
})

export const { clearError, setUser, updateUser } = authSlice.actions
export default authSlice.reducer