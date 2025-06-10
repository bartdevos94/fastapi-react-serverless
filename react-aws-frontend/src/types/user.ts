import { User } from "./auth"

// src/types/user.ts
export interface UserUpdate {
  first_name?: string
  last_name?: string
  phone_number?: string
}

export interface UserProfile extends User {
  avatar_url?: string
  full_name?: string
}

export interface UserStats {
  total_users: number
  active_users: number
  verified_users: number
  inactive_users: number
}

export { User }

