// src/components/auth/LoginForm.tsx
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { loginSchema } from '@/utils/validation'
import { LoginCredentials } from '@/types/auth'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToasts'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ROUTES } from '@/utils/constants'

export const LoginForm: React.FC = () => {
  const { signIn, isLoading, error } = useAuth()
  const { success, error: showError } = useToast()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginCredentials) => {
    try {
      await signIn(data).unwrap()
      success('Login Successful', 'Welcome back!')
    } catch (error: any) {
      showError('Login Failed', error || 'Invalid credentials')
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center">Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            required
            error={errors.email?.message}
            {...register('email')}
          />
          
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            required
            error={errors.password?.message}
            {...register('password')}
          />

          {error && (
            <div className="text-sm text-red-600 text-center">{error}</div>
          )}

          <Button
            type="submit"
            className="w-full"
            loading={isLoading}
            disabled={isLoading}
          >
            Sign In
          </Button>

          <div className="text-center space-y-2">
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="text-sm text-primary-600 hover:text-primary-500"
            >
              Forgot your password?
            </Link>
            <div className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to={ROUTES.SIGNUP}
                className="text-primary-600 hover:text-primary-500 font-medium"
              >
                Sign up
              </Link>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}