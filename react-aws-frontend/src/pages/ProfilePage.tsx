// src/pages/ProfilePage.tsx
import React, { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { ProfileView } from '@/components/profile/ProfileView'
import { ProfileEdit } from '@/components/profile/ProfileEdit'
import { AvatarUpload } from '@/components/profile/AvatarUpload'
import { ProfileSettings } from '@/components/profile/ProfileSettings'

export const ProfilePage: React.FC = () => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile')

  if (!user) return null

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'settings'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Account Settings
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' ? (
        <div className="space-y-8">
          <AvatarUpload />
          {isEditing ? (
            <ProfileEdit
              onCancel={() => setIsEditing(false)}
              onSave={() => setIsEditing(false)}
            />
          ) : (
            <ProfileView onEdit={() => setIsEditing(true)} />
          )}
        </div>
      ) : (
        <ProfileSettings />
      )}
    </div>
  )
}