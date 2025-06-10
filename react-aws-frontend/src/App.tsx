// src/App.tsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from '@/store'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { Layout } from '@/components/common/Layout'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { SignupPage } from '@/pages/SignupPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { DashboardPage } from '@/pages/DashboardPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { EmailConfirmationForm } from '@/components/auth/EmailConfirmationForm'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'
import { ROUTES } from '@/utils/constants'
import '@/styles/globals.css'

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* Public Routes */}
              <Route index element={<HomePage />} />
              <Route path={ROUTES.LOGIN} element={<LoginPage />} />
              <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
              
              {/* Auth-related routes */}
              <Route 
                path={ROUTES.CONFIRM_EMAIL} 
                element={
                  <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
                    <EmailConfirmationForm />
                  </div>
                } 
              />
              <Route 
                path={ROUTES.FORGOT_PASSWORD} 
                element={
                  <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
                    <ForgotPasswordForm />
                  </div>
                } 
              />
              <Route 
                path={ROUTES.RESET_PASSWORD} 
                element={
                  <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
                    <ResetPasswordForm />
                  </div>
                } 
              />

              {/* Protected Routes */}
              <Route
                path={ROUTES.DASHBOARD}
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.PROFILE}
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Catch all route */}
              <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to={ROUTES.NOT_FOUND} replace />} />
            </Route>
          </Routes>
        </Router>
      </Provider>
    </ErrorBoundary>
  )
}

export default App