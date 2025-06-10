// src/utils/validation.ts
import { z } from 'zod'
import { VALIDATION_RULES } from './constants'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(VALIDATION_RULES.PASSWORD.MIN_LENGTH, `Password must be at least ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} characters`)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number'),
  confirm_password: z.string(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone_number: z.string().optional(),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
})

export const emailConfirmationSchema = z.object({
  email: z.string().email('Invalid email address'),
  confirmation_code: z.string().length(6, 'Confirmation code must be 6 digits'),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
  confirmation_code: z.string().length(6, 'Confirmation code must be 6 digits'),
  new_password: z
    .string()
    .min(VALIDATION_RULES.PASSWORD.MIN_LENGTH, `Password must be at least ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} characters`)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number'),
  confirm_password: z.string(),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
})

export const userUpdateSchema = z.object({
  first_name: z.string().min(1, 'First name is required').optional(),
  last_name: z.string().min(1, 'Last name is required').optional(),
  phone_number: z.string().optional(),
})
