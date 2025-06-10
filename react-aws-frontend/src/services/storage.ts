// src/services/storage.ts
import { STORAGE_KEYS } from '@/utils/constants'

class StorageService {
  private isAvailable(): boolean {
    try {
      const test = '__storage_test__'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch {
      return false
    }
  }

  setItem(key: string, value: string): void {
    if (!this.isAvailable()) return
    
    try {
      localStorage.setItem(key, value)
    } catch (error) {
      console.warn('Failed to set item in localStorage:', error)
    }
  }

  getItem(key: string): string | null {
    if (!this.isAvailable()) return null
    
    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.warn('Failed to get item from localStorage:', error)
      return null
    }
  }

  removeItem(key: string): void {
    if (!this.isAvailable()) return
    
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.warn('Failed to remove item from localStorage:', error)
    }
  }

  clear(): void {
    if (!this.isAvailable()) return
    
    try {
      localStorage.clear()
    } catch (error) {
      console.warn('Failed to clear localStorage:', error)
    }
  }

  // Typed methods for common data
  setObject<T>(key: string, value: T): void {
    this.setItem(key, JSON.stringify(value))
  }

  getObject<T>(key: string): T | null {
    const item = this.getItem(key)
    if (!item) return null
    
    try {
      return JSON.parse(item) as T
    } catch {
      return null
    }
  }

  // Auth-specific methods
  setTokens(accessToken: string, refreshToken: string): void {
    this.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
    this.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
  }

  clearTokens(): void {
    this.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    this.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
  }

  getAccessToken(): string | null {
    return this.getItem(STORAGE_KEYS.ACCESS_TOKEN)
  }

  getRefreshToken(): string | null {
    return this.getItem(STORAGE_KEYS.REFRESH_TOKEN)
  }

  setUserData(user: any): void {
    this.setObject(STORAGE_KEYS.USER_DATA, user)
  }

  getUserData<T>(): T | null {
    return this.getObject<T>(STORAGE_KEYS.USER_DATA)
  }

  clearUserData(): void {
    this.removeItem(STORAGE_KEYS.USER_DATA)
  }

  clearAll(): void {
    this.clearTokens()
    this.clearUserData()
    this.removeItem(STORAGE_KEYS.THEME)
    this.removeItem(STORAGE_KEYS.LANGUAGE)
  }
}

export const storage = new StorageService()