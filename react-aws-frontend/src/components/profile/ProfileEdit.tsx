// src/components/profile/ProfileEdit.tsx
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { userUpdateSchema } from '@/utils/validation'
import { UserUpdate } from '@/types/user'
import { useAuth } from '@/hooks/useAuth'
import { useAppDispatch } from '@/store'
import { updateProfile } from '@/store/userSlice'
import { useToast } from '@/hooks/useToast'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

interface ProfileEditProps {
  onCancel: () => void
  onSave: () => void
}

export const ProfileEdit: React.FC<ProfileEditProps> = ({ onCancel, onSave }) => {
  const { user } = useAuth()
  const dispatch = useAppDispatch()
  const { success, error } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserUpdate>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      phone_number: user?.phone_number || '',
    },
  })

  const onSubmit = async (data: UserUpdate) => {
    try {
      await dispatch(updateProfile(data)).unwrap()
      success('Profile Updated', 'Your profile has been updated successfully')
      onSave()
    } catch (err: any) {
      error('Update Failed', err || 'Failed to update profile')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="Enter your first name"
              error={errors.first_name?.message}
              {...register('first_name')}
            />
            <Input
              label="Last Name"
              placeholder="Enter your last name"
              error={errors.last_name?.message}
              {...register('last_name')}
            />
          </div>

          <Input
            label="Phone Number"
            type="tel"
            placeholder="Enter your phone number"
            error={errors.phone_number?.message}
            {...register('phone_number')}
          />

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}