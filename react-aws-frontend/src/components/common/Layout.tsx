// src/components/common/Layout.tsx
import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { ToastContainer } from '@/components/ui/Toast'
import { LoadingOverlay } from '@/components/ui/LoadingSpinner'
import { useAppSelector } from '@/store'

export function Layout(): React.JSX.Element {
  const overlayLoading = useAppSelector((state) => state.ui.loading.overlay)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
      <LoadingOverlay isVisible={overlayLoading} />
    </div>
  )
}