'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { content as contentApi } from '@/lib/api';
import VideoPlayerContainer, { VideoContent } from '@/components/video/VideoPlayerContainer';

export default function WatchPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [content, setContent] = useState<VideoContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadContent();
    }
  }, [id]);

  const loadContent = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await contentApi.getDetails(id);
      setContent(response.data.data);
    } catch (error) {
      console.error('Failed to load content:', error);
      setError('Failed to load video content');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Error</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!content) {
    return null;
  }

  return (
    <VideoPlayerContainer 
      content={content}
      autoplay={true}
      onBack={() => router.back()}
    />
  );
}