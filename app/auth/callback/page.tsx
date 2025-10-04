'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { auth } from '@/lib/api';

function AuthCallbackContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    const error = searchParams.get('error');

    if (error) {
      console.error('Auth error:', error);
      window.location.href = `/auth/login?error=${error}`;
      return;
    }

    // The auth.handleOAuthCallback will handle everything:
    // 1. Exchange token with backend
    // 2. Store token and user in store
    // 3. Redirect to appropriate dashboard
    try {
      await auth.handleOAuthCallback();
    } catch (err) {
      console.error('Failed to complete authentication:', err);
      window.location.href = '/auth/login?error=auth_failed';
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-white">Completing authentication...</h2>
        <p className="text-gray-400 mt-2">Please wait while we set up your account</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-white">Loading...</h2>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}