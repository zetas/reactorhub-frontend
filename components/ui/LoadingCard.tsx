import React from 'react';
import { clsx } from 'clsx';

export interface LoadingCardProps {
  className?: string;
  lines?: number;
  showAvatar?: boolean;
}

const LoadingCard: React.FC<LoadingCardProps> = ({
  className,
  lines = 3,
  showAvatar = false
}) => {
  return (
    <div className={clsx('animate-pulse rounded-lg border border-gray-700 bg-gray-800 text-white shadow-sm p-6', className)}>
      <div className="space-y-4">
        {showAvatar && (
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/6"></div>
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          {Array.from({ length: lines }).map((_, index) => (
            <div
              key={index}
              className={clsx(
                'h-4 bg-gray-300 dark:bg-gray-700 rounded',
                index === lines - 1 ? 'w-3/4' : 'w-full'
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export { LoadingCard };