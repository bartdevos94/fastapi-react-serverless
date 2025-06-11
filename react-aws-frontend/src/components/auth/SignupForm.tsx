// src/components/auth/SignupForm.tsx
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { signupSchema } from '@/utils/validation'
import { SignupData } from '@/types/auth'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ROUTES } from '@/utils/constants'

export const SignupForm: React.FC = () => {
  const navigate = useNavigate()
  const { signUp, isLoading, error } = useAuth()
  const { success, error: showError } = useToast()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupData) => {
    try {
      await signUp(data).unwrap()
      success('Account Created', 'Please check your email to verify your account')
      navigate(ROUTES.CONFIRM_EMAIL, { state: { email: data.email } })
    } catch (error: any) {
      showError('Signup Failed', error || 'Failed to create account')
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center">Create Account</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="John"
              error={errors.first_name?.message}
              {...register('first_name')}
            />
            <Input
              label="Last Name"
              placeholder="Doe"
              error={errors.last_name?.message}
              {...register('last_name')}
            />
          </div>

          <Input
            label="Email"
            type="email"
            placeholder="john@example.com"
            required
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Phone Number"
            type="tel"
            placeholder="+1 (555) 123-4567"
            error={errors.phone_number?.message}
            {...register('phone_number')}
          />
          
          <Input
            label="Password"
            type="password"
            placeholder="Create a password"
            required
            error={errors.password?.message}
            {...register('password')}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            required
            error={errors.confirm_password?.message}
            {...register('confirm_password')}
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
            Create Account
          </Button>

          <div className="text-center text-sm text-gray-600">
            Already have an account?{' '}
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