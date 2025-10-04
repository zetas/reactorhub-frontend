'use client';

import { clsx } from 'clsx';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'white' | 'red' | 'gray';
  className?: string;
  label?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  color = 'white',
  className,
  label = 'Loading...'
}: LoadingSpinnerProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'h-4 w-4';
      case 'md': return 'h-6 w-6';
      case 'lg': return 'h-8 w-8';
      case 'xl': return 'h-12 w-12';
      default: return 'h-6 w-6';
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'white': return 'text-white';
      case 'red': return 'text-red-500';
      case 'gray': return 'text-gray-400';
      default: return 'text-white';
    }
  };

  return (
    <div 
      className={clsx('inline-flex items-center justify-center', className)}
      role="status"
      aria-label={label}
    >
      <svg
        className={clsx(
          getSizeClasses(),
          getColorClasses(),
          'animate-spin'
        )}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  );
}

// Full-screen loading overlay component
interface LoadingOverlayProps {
  message?: string;
  transparent?: boolean;
}

export function LoadingOverlay({ 
  message = 'Loading...', 
  transparent = false 
}: LoadingOverlayProps) {
  return (
    <div 
      className={clsx(
        'fixed inset-0 z-50 flex items-center justify-center',
        transparent ? 'bg-black/50' : 'bg-black/80'
      )}
      role="status"
      aria-label={message}
    >
      <div className="text-center">
        <LoadingSpinner size="xl" color="white" className="mb-4" />
        <p className="text-white text-lg font-medium">{message}</p>
      </div>
    </div>
  );
}

// Inline loading state for content areas
interface LoadingContentProps {
  lines?: number;
  className?: string;
}

export function LoadingContent({ lines = 3, className }: LoadingContentProps) {
  return (
    <div className={clsx('animate-pulse space-y-3', className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={clsx(
            'h-4 bg-gray-700 rounded',
            index === lines - 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  );
}