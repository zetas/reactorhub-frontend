import React from 'react';
import { useRouter } from 'next/navigation';
import { useContinueWatching } from '@/hooks/useContinueWatching';
import { WatchCard } from './WatchCard';
import { WatchCardSkeletonGrid } from './WatchCardSkeleton';
import { WatchSession } from '@/types/continueWatching';

interface ContinueWatchingProps {
  limit?: number;
  className?: string;
}

export const ContinueWatching: React.FC<ContinueWatchingProps> = ({
  limit = 12,
  className = '',
}) => {
  const router = useRouter();
  const { data, isLoading, isError, error, refetch } = useContinueWatching({ limit });

  const handleResume = (session: WatchSession) => {
    // Build the video URL with timestamp parameter
    const timestamp = Math.floor(session.progress);
    const videoUrl = `/watch/${session.content_id}?t=${timestamp}`;

    router.push(videoUrl);
  };

  // Show error state
  if (isError) {
    return (
      <section className={`relative ${className}`}>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            Continue Watching
          </h2>
        </div>
        <div className="rounded-lg bg-red-900/20 border border-red-900/50 p-6">
          <div className="flex items-start gap-3">
            <svg
              className="h-6 w-6 flex-shrink-0 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">
                Failed to load continue watching
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                {error?.message || 'An unexpected error occurred'}
              </p>
              <button
                onClick={() => refetch()}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Don't render if no data and not loading
  if (!isLoading && (!data || data.sessions.length === 0)) {
    return null;
  }

  return (
    <section className={`relative ${className}`}>
      {/* Section header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            Continue Watching
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Pick up where you left off
          </p>
        </div>

        {/* Refresh indicator */}
        {!isLoading && data && (
          <button
            onClick={() => refetch()}
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
            aria-label="Refresh continue watching"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {isLoading ? (
          <WatchCardSkeletonGrid count={limit} />
        ) : (
          data?.sessions.map((session) => (
            <WatchCard
              key={session.content_id}
              session={session}
              onResume={handleResume}
            />
          ))
        )}
      </div>

      {/* Empty state (when data loads but no sessions) */}
      {!isLoading && data && data.sessions.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg bg-slate-800/50 py-16 px-6 text-center">
          <svg
            className="mb-4 h-16 w-16 text-slate-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-white">
            No videos in progress
          </h3>
          <p className="mt-2 max-w-sm text-sm text-slate-400">
            Start watching content and it will appear here for easy access
          </p>
        </div>
      )}

      {/* Auto-refresh indicator */}
      {!isLoading && data && data.sessions.length > 0 && (
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span>Auto-refreshes every 30 seconds</span>
        </div>
      )}
    </section>
  );
};
