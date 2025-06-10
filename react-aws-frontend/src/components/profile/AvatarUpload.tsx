// src/components/profile/AvatarUpload.tsx
import React, { useRef, useState } from 'react'
import { Camera, Upload, X } from 'lucide-react'
import { useFileUpload } from '@/hooks/useFileUpload'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { getInitials, formatName } from '@/utils/helpers'

export const AvatarUpload: React.FC = () => {
  const { user } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  
  const { uploadFile, uploadProgress, isUploading, error, reset } = useFileUpload({
    onSuccess: () => {
      setPreviewUrl(null)
      reset()
    },
    onError: () => {
      setPreviewUrl(null)
    },
  })

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = () => {
    const file = fileInputRef.current?.files?.[0]
    if (file) {
      uploadFile(file)
    }
  }

  const handleCancel = () => {
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    reset()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Camera className="h-5 w-5 mr-2" />
          Profile Picture
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-6">
          {/* Current/Preview Avatar */}
          <div className="relative">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">
                  {getInitials(user?.first_name, user?.last_name)}
                </span>
              </div>
            )}
            
            {isUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                <div className="text-white text-xs">
                  {uploadProgress}%
                </div>
              </div>
            )}
          </div>

          {/* Upload Controls */}
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-2">
              {formatName(user?.first_name, user?.last_name)}
            </p>
            
            {!previewUrl ? (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Photo
                </Button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={handleUpload}
                  loading={isUploading}
                  disabled={isUploading}
                >
                  Upload
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="text-sm text-red-600">{error}</div>
        )}

        {/* Guidelines */}
        <div className="text-xs text-gray-500">
          <p>• Recommended size: 400x400 pixels</p>
          <p>• Accepted formats: JPG, PNG, WebP</p>
          <p>• Maximum file size: 5MB</p>
        </div>
      </CardContent>
    </Card>
  )
}