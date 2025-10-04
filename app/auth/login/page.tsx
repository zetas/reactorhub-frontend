'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Film, Users, TrendingUp, Shield } from 'lucide-react';
import { auth } from '@/lib/api';

export default function LoginPage() {
  const [selectedType, setSelectedType] = useState<'creator' | 'patron' | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleCreatorPlatformLogin = async (type: 'creator' | 'patron') => {
    setIsConnecting(true);
    // Store the selected account type for after OAuth callback
    localStorage.setItem('selected_account_type', type);
    // Redirect to Creator Platform OAuth with the correct type
    auth.connectCreatorPlatform(type);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex safe-area-top safe-area-bottom">
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center mobile-padding">
        <div className="max-w-md w-full space-y-6 sm:space-y-8">
          <div className="text-center">
            <Link href="/" className="inline-block">
              <h1 className="text-2xl sm:text-3xl font-bold text-red-500">ReactorHub</h1>
            </Link>
            <h2 className="mt-4 sm:mt-6 mobile-heading font-bold text-white">
              Welcome back
            </h2>
            <p className="mt-2 text-gray-400 mobile-text">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-red-500 hover:text-red-400 font-medium">
                Sign up
              </Link>
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* Account Type Selection */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-medium text-white text-center">Choose your account type</h3>
              
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                <button
                  onClick={() => setSelectedType('patron')}
                  className={`relative card-mobile rounded-lg border-2 transition-all duration-200 touch-target ${
                    selectedType === 'patron'
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-gray-600 bg-gray-800/50 hover:border-gray-500 active:border-red-400'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <Users className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-white font-medium mobile-text">I want to watch</h4>
                      <p className="text-gray-400 text-xs sm:text-sm">Access content from creators you support</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedType('creator')}
                  className={`relative card-mobile rounded-lg border-2 transition-all duration-200 touch-target ${
                    selectedType === 'creator'
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-gray-600 bg-gray-800/50 hover:border-gray-500 active:border-red-400'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <Film className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-white font-medium mobile-text">I'm a creator</h4>
                      <p className="text-gray-400 text-xs sm:text-sm">Organize and share your creator subscription content</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Creator Platform Login Button */}
            <button
              onClick={() => selectedType && handleCreatorPlatformLogin(selectedType)}
              disabled={!selectedType || isConnecting}
              className="w-full btn-mobile-lg border border-transparent rounded-lg shadow-sm text-white font-medium bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 active:bg-purple-800"
            >
              {isConnecting ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Connecting...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M0 .48v23.04h4.22V.48zm15.385 0v8.423c0 4.222-3.384 7.64-7.607 7.64-4.219 0-7.607-3.418-7.607-7.64V.48h4.219v8.423c0 1.93 1.56 3.49 3.388 3.49 1.832 0 3.388-1.56 3.388-3.49V.48z"/>
                  </svg>
                  <span>
                    {selectedType === 'patron'
                      ? 'Sign in as Viewer'
                      : selectedType === 'creator'
                      ? 'Sign in as Creator'
                      : 'Continue'}
                  </span>
                </div>
              )}
            </button>

            {!selectedType && (
              <p className="text-center mobile-text text-gray-400">
                Please select your account type first
              </p>
            )}

            <div className="text-center">
              <p className="text-xs sm:text-xs text-gray-500">
                By continuing, you agree to our{' '}
                <Link href="/terms" className="text-red-500 hover:text-red-400 active:text-red-300">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-red-500 hover:text-red-400 active:text-red-300">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Features */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-red-600 to-purple-700">
        <div className="flex flex-col justify-center px-12 text-white">
          <h2 className="text-4xl font-bold mb-8">Join the ReactorHub community</h2>
          
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Film className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Netflix-Style Interface</h3>
                <p className="text-red-100">
                  Browse your favorite creators' content in a beautiful, organized interface
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">All Your Creators</h3>
                <p className="text-red-100">
                  Access content from all your supported creators in one place
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
                <p className="text-red-100">
                  Continue watching where you left off, across all devices
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Secure Access</h3>
                <p className="text-red-100">
                  Your creator platform connections and data are always protected
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}