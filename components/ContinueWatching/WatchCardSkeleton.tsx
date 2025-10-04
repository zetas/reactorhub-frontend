import React from 'react';

export const WatchCardSkeleton: React.FC = () => {
  return (
    <div className="overflow-hidden rounded-lg bg-slate-800 animate-pulse">
      {/* Thumbnail skeleton */}
      <div className="relative aspect-video w-full bg-slate-700" />

      {/* Content info skeleton */}
      <div className="p-3 space-y-3">
        {/* Title lines */}
        <div className="space-y-2">
          <div className="h-4 bg-slate-700 rounded w-full" />
          <div className="h-4 bg-slate-700 rounded w-3/4" />
        </div>

        {/* Series name */}
        <div className="h-3 bg-slate-700 rounded w-1/2" />

        {/* Footer info */}
        <div className="flex items-center justify-between">
          <div className="h-3 bg-slate-700 rounded w-1/3" />
          <div className="h-3 bg-slate-700 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
};

interface WatchCardSkeletonGridProps {
  count?: number;
}

export const WatchCardSkeletonGrid: React.FC<WatchCardSkeletonGridProps> = ({ count = 6 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <WatchCardSkeleton key={index} />
      ))}
    </>
  );
};
