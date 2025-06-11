// src/utils/constants.ts
export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: '/api/v1/auth/signup',
    LOGIN: '/api/v1/auth/login',
    LOGOUT: '/api/v1/auth/logout',
    REFRESH: '/api/v1/auth/refresh',
    CONFIRM_EMAIL: '/api/v1/auth/confirm-email',
    FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
    RESET_PASSWORD: '/api/v1/auth/reset-password',
  },
  USERS: {
    ME: '/api/v1/users/me',
    BY_ID: (id: string) => `/api/v1/users/${id}`,
    UPLOAD_AVATAR: '/api/v1/users/upload-avatar',
    PRESIGNED_URL: '/api/v1/users/presigned-url',
  },
  HEALTH: '/health',
} as const

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  CONFIRM_EMAIL: '/confirm-email',
  NOT_FOUND: '/404',
} as const

export const VALIDATION_RULES = {
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SYMBOLS: false,
  },
  FILE_UPLOAD: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  },
} as const

export const UI_CONFIG = {
  TOAST: {
    DEFAULT_DURATION: 5000,
    SUCCESS_DURATION: 3000,
    ERROR_DURATION: 7000,
  },
  ANIMATION: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
  },
  DEBOUNCE: {
    SEARCH: 300,
    INPUT: 500,
  },
} as const