// src/components/auth/EmailConfirmationForm.tsx
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocation, useNavigate } from 'react-router-dom'
import { emailConfirmationSchema } from '@/utils/validation'
import { EmailConfirmation } from '@/types/auth'
import { authService } from '@/services/auth'
import { useToast } from '@/hooks/useToast'
import { useApi } from '@/hooks/useApi'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ROUTES } from '@/utils/constants'

export const EmailConfirmationForm: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { success, error: showError } = useToast()
  
  const { execute, loading } = useApi({
    onSuccess: () => {
      success('Email Confirmed', 'Your email has been verified successfully')
      navigate(ROUTES.LOGIN)
    },
    onError: (error) => {
      showError('Confirmation Failed', error.detail)
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailConfirmation>({
    resolver: zodResolver(emailConfirmationSchema),
    defaultValues: {
      email: location.state?.email || '',
    },
  })

  const onSubmit = async (data: EmailConfirmation) => {
    await execute(() => authService.confirmEmail(data))
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center">Confirm Your Email</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <p className="text-sm text-gray-600">
            We've sent a confirmation code to your email address. Please enter it below.
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
          
          <Input
            label="Confirmation Code"
            placeholder="Enter 6-digit code"
            required
            maxLength={6}
            error={errors.confirmation_code?.message}
            {...register('confirmation_code')}
          />

          <Button
            type="submit"
            className="w-full"
            loading={loading}
            disabled={loading}
          >
            Confirm Email
          </Button>

          <div className="text-center text-sm text-gray-600">
            Didn't receive a code?{' '}
            <button
              type="button"
              className="text-primary-600 hover:text-primary-500 font-medium"
              onClick={() => {
                // Handle resend logic here
                showError('Resend Code', 'Feature not implemented yet')
              }}
            >
              Resend
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}