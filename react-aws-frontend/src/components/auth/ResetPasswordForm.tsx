// src/components/auth/ResetPasswordForm.tsx
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { resetPasswordSchema } from '@/utils/validation'
import { PasswordResetConfirm } from '@/types/auth'
import { authService } from '@/services/auth'
import { useToast } from '@/hooks/useToast'
import { useApi } from '@/hooks/useApi'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ROUTES } from '@/utils/constants'

export const ResetPasswordForm: React.FC = () => {
  const navigate = useNavigate()
  const { success, error: showError } = useToast()
  
  const { execute, loading } = useApi({
    onSuccess: () => {
      success('Password Reset', 'Your password has been reset successfully')
      navigate(ROUTES.LOGIN)
    },
    onError: (error) => {
      showError('Reset Failed', error.detail)
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordResetConfirm>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data: PasswordResetConfirm) => {
    await execute(() => authService.resetPassword(data))
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center">Set New Password</CardTitle>
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
            label="Confirmation Code"
            placeholder="Enter 6-digit code"
            required
            maxLength={6}
            error={errors.confirmation_code?.message}
            {...register('confirmation_code')}
          />
          
          <Input
            label="New Password"
            type="password"
            placeholder="Enter new password"
            required
            error={errors.new_password?.message}
            {...register('new_password')}
          />

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Confirm new password"
            required
            error={errors.confirm_password?.message}
            {...register('confirm_password')}
          />

          <Button
            type="submit"
            className="w-full"
            loading={loading}
            disabled={loading}
          >
            Reset Password
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}