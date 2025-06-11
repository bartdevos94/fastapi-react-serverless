// src/store/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { User, UserUpdate } from '@/types/user'
import { FileUploadResponse } from '@/types/api'
import { api } from '@/services/api'
import { API_ENDPOINTS } from '@/utils/constants'

interface UserState {
  profile: User | null
  isLoading: boolean
  error: string | null
  uploadProgress: number
}

const initialState: UserState = {
  profile: null,
  isLoading: false,
  error: null,
  uploadProgress: 0,
}

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (data: UserUpdate, { rejectWithValue }) => {
    try {
      const response = await api.put<User>(API_ENDPOINTS.USERS.ME, data)
      return response.data!
    } catch (error: any) {
      return rejectWithValue(error.detail || 'Failed to update profile')
    }
  }
)

export const uploadAvatar = createAsyncThunk(
  'user/uploadAvatar',
  async (file: File, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.uploadFile<FileUploadResponse>(
        API_ENDPOINTS.USERS.UPLOAD_AVATAR,
        file,
        (progress) => {
          dispatch(setUploadProgress(progress))
        }
      )
      return response.data!
    } catch (error: any) {
      return rejectWithValue(error.detail || 'Failed to upload avatar')
    }
  }
)

export const deleteAccount = createAsyncThunk(
  'user/deleteAccount',
  async (_, { rejectWithValue }) => {
    try {
      await api.delete(API_ENDPOINTS.USERS.ME)
    } catch (error: any) {
      return rejectWithValue(error.detail || 'Failed to delete account')
    }
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload
    },
    resetUploadProgress: (state) => {
      state.uploadProgress = 0
    },
  },
  extraReducers: (builder) => {
    builder
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.profile = action.payload
        state.error = null
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      // Upload Avatar
      .addCase(uploadAvatar.pending, (state) => {
        state.isLoading = true
        state.error = null
        state.uploadProgress = 0
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.isLoading = false
        state.error = null
        state.uploadProgress = 100
        // Update profile with new avatar
        if (state.profile) {
          state.profile.avatar_key = action.payload.file_key
        }
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        state.uploadProgress = 0
      })
      
      // Delete Account
      .addCase(deleteAccount.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.isLoading = false
        state.profile = null
        state.error = null
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, setUploadProgress, resetUploadProgress } = userSlice.actions
export default userSlice.reducer