// src/components/profile/ProfileSettings.tsx
import React, { useState } from 'react'
import { Shield, Trash2, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useAppDispatch } from '@/store'
import { deleteAccount } from '@/store/userSlice'
import { useToast } from '@/hooks/useToast'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { ROUTES } from '@/utils/constants'

export const ProfileSettings: React.FC = () => {
  const { user, signOut } = useAuth()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { success, error } = useToast()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      await dispatch(deleteAccount()).unwrap()
      await signOut()
      success('Account Deleted', 'Your account has been permanently deleted')
      navigate(ROUTES.HOME)
    } catch (err: any) {
      error('Delete Failed', err || 'Failed to delete account')
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
    }
  }

  if (!user) return null

  return (
    <div className="space-y-6">
      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Email Verification</h3>
              <p className="text-sm text-gray-600">
                {user.email_verified
                  ? 'Your email address is verified'
                  : 'Please verify your email address'}
              </p>
            </div>
            {!user.email_verified && (
              <Button variant="secondary" size="sm">
                Resend Verification
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Password</h3>
              <p className="text-sm text-gray-600">
                Change your account password
              </p>
            </div>
            <Button variant="secondary" size="sm">
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-red-600">Delete Account</h3>
              <p className="text-sm text-gray-600">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div>
              <h3 className="font-medium">Are you absolutely sure?</h3>
              <p className="text-sm text-gray-600">
                This action cannot be undone. This will permanently delete your
                account and remove all your data from our servers.
              </p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-800">
              <strong>This will delete:</strong>
            </p>
            <ul className="text-sm text-red-700 mt-1 list-disc list-inside">
              <li>Your profile and account information</li>
              <li>All uploaded files and documents</li>
              <li>Your activity history</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteAccount}
              loading={isDeleting}
              disabled={isDeleting}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}