// src/components/auth/ForgotPasswordForm.tsx
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { forgotPasswordSchema } from '@/utils/validation'
import { PasswordReset } from '@/types/auth'
import { authService } from '@/services/auth'
import { useToast } from '@/hooks/useToast'
import { useApi } from '@/hooks/useApi'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ROUTES } from '@/utils/constants'

export const ForgotPasswordForm: React.FC = () => {
  const navigate = useNavigate()
  const { success, error: showError } = useToast()
  
  const { execute, loading } = useApi({
    onSuccess: () => {
      success('Reset Code Sent', 'Please check your email for the reset code')
      navigate(ROUTES.RESET_PASSWORD)
    },
    onError: (error) => {
      showError('Reset Failed', error.detail)
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordReset>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: PasswordReset) => {
    await execute(() => authService.forgotPassword(data))
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center">Reset Password</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <p className="text-sm text-gray-600">
            Enter your email address and we'll send you a code to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            required
            error={errors.email?.message}
            {...register('email')}
          />

          <Button
            type="submit"
            className="w-full"
            loading={loading}
            disabled={loading}
          >
            Send Reset Code
          </Button>

          <div className="text-center text-sm text-gray-600">
            Remember your password?{' '}
            <Link
              to={ROUTES.LOGIN}
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              Sign in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}