// src/components/common/Header.tsx
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, User, LogOut, Settings } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useToggle } from '@/hooks/useToggle'
import { useClickOutside } from '@/hooks/useClickOutside'
import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/utils/constants'
import { formatName, getInitials } from '@/utils/helpers'

export const Header: React.FC = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, signOut } = useAuth()
  const [mobileMenuOpen, toggleMobileMenu, setMobileMenuOpen] = useToggle(false)
  const [userMenuOpen, toggleUserMenu, setUserMenuOpen] = useToggle(false)
  
  const mobileMenuRef = useClickOutside<HTMLDivElement>(() => setMobileMenuOpen(false))
  const userMenuRef = useClickOutside<HTMLDivElement>(() => setUserMenuOpen(false))

  const handleLogout = async () => {
    try {
      await signOut()
      navigate(ROUTES.HOME)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const navigationItems = [
    { name: 'Home', href: ROUTES.HOME },
    { name: 'Dashboard', href: ROUTES.DASHBOARD, requireAuth: true },
  ]

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to={ROUTES.HOME} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">FA</span>
              </div>
              <span className="font-semibold text-xl text-gray-900">FastAPI App</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigationItems
              .filter(item => !item.requireAuth || isAuthenticated)
              .map(item => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  {item.name}
                </Link>
              ))}
          </nav>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <Button
                  variant="ghost"
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2"
                >
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {getInitials(user?.first_name, user?.last_name)}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {formatName(user?.first_name, user?.last_name)}
                  </span>
                </Button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to={ROUTES.PROFILE}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User className="mr-3 h-4 w-4" />
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings className="mr-3 h-4 w-4" />
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false)
                        handleLogout()
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to={ROUTES.LOGIN}>
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to={ROUTES.SIGNUP}>
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden" ref={mobileMenuRef}>
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              {navigationItems
                .filter(item => !item.requireAuth || isAuthenticated)
                .map(item => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-gray-600 hover:text-gray-900 block px-3 py-2 text-base font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

              {isAuthenticated ? (
                <div className="border-t pt-4 pb-3">
                  <div className="flex items-center px-3">
                    <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {getInitials(user?.first_name, user?.last_name)}
                      </span>
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">
                        {formatName(user?.first_name, user?.last_name)}
                      </div>
                      <div className="text-sm font-medium text-gray-500">
                        {user?.email}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <Link
                      to={ROUTES.PROFILE}
                      className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false)
                        handleLogout()
                      }}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-t pt-4 pb-3 space-y-1">
                  <Link
                    to={ROUTES.LOGIN}
                    className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to={ROUTES.SIGNUP}
                    className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}