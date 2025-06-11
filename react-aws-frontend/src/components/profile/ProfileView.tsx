// src/components/profile/ProfileView.tsx
import React from 'react'
import { User, Mail, Phone, Calendar, CheckCircle, XCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatDate, formatName, getInitials } from '@/utils/helpers'

interface ProfileViewProps {
  onEdit: () => void
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onEdit }) => {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {getInitials(user.first_name, user.last_name)}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {formatName(user.first_name, user.last_name)}
              </h1>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex items-center mt-2">
                {user.email_verified ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm">Verified</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <XCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm">Not verified</span>
                  </div>
                )}
              </div>
            </div>
            <Button onClick={onEdit}>Edit Profile</Button>
          </div>
        </CardContent>
      </Card>

      {/* Profile Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">First Name</label>
              <p className="text-gray-900">{user.first_name || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Last Name</label>
              <p className="text-gray-900">{user.last_name || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Phone Number</label>
              <p className="text-gray-900">{user.phone_number || 'Not provided'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Email Address</label>
              <div className="flex items-center space-x-2">
                <p className="text-gray-900">{user.email}</p>
                {user.email_verified ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Account Status</label>
              <p className="text-gray-900">
                {user.is_active ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Member Since</label>
              <p className="text-gray-900">
                {formatDate(user.created_at)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}