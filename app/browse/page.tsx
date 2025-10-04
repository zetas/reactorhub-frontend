'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import HeroBanner from '@/components/netflix/HeroBanner';
import ContentRow from '@/components/netflix/ContentRow';
import CreatorRow from '@/components/netflix/CreatorRow';
import { fetchBrowseCollections, BrowseCollections } from '@/lib/services/browse';
import { useAuthStore, useWatchStore } from '@/lib/store';

export default function BrowsePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { setContinueWatching } = useWatchStore();
  const [collections, setCollections] = useState<BrowseCollections | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await fetchBrowseCollections();
        setCollections(result);
        setContinueWatching(result.continueWatching);
      } catch (err) {
        console.error('Failed to load browse data', err);
        setError('Unable to load your dashboard right now. Please try again in a few minutes.');
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, []);

  const featuredContent = useMemo(() => collections?.featured ?? null, [collections]);
  const continueWatching = collections?.continueWatching ?? [];
  const recentlyWatched = collections?.recentlyWatched ?? [];
  const myCreators = collections?.myCreators ?? [];
  const allCreators = collections?.creators ?? [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-3xl font-semibold">We hit a snag</h1>
          <p className="text-gray-300">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-full bg-white px-6 py-3 font-semibold text-black hover:bg-gray-200 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {featuredContent && (
        <HeroBanner
          content={featuredContent}
          onPlay={() => router.push(`/watch/${featuredContent.id}`)}
          onMoreInfo={() => router.push(`/content/${featuredContent.id}`)}
        />
      )}

      <div className="relative z-10 -mt-16 pb-16 space-y-10">
        {continueWatching.length > 0 && (
          <ContentRow title="Continue Watching" items={continueWatching} />
        )}

        {myCreators.length > 0 && (
          <CreatorRow title="My Creators" creators={myCreators} />
        )}

        {recentlyWatched.length > 0 && (
          <ContentRow title="Recently Watched" items={recentlyWatched} />
        )}

        {allCreators.length > 0 && (
          <CreatorRow title="Discover Creators" creators={allCreators} />
        )}
      </div>
    </div>
  );
}
