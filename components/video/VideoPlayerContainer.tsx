'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import VideoPlayer from './VideoPlayer';
import { useVideoProgress } from '@/lib/hooks/useVideoProgress';
import LoadingSpinner from '@/components/netflix/LoadingSpinner';

export interface VideoContent {
  id: string;
  title: string;
  description?: string;
  video_url?: string;
  youtube_id?: string;
  vimeo_id?: string;
  duration_seconds?: number;
  series_name?: string;
  episode_number?: string;
  next_episode_id?: string;
  previous_episode_id?: string;
  creator_name?: string;
  watched_seconds?: number;
  is_completed?: boolean;
  qualities?: Array<{ label: string; src: string }>;
}

export interface VideoPlayerContainerProps {
  /** Content data */
  content: VideoContent;
  /** Whether to show back button */
  showBackButton?: boolean;
  /** Custom back button handler */
  onBack?: () => void;
  /** Whether to autoplay */
  autoplay?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Whether content is loading */
  loading?: boolean;
  /** Error message */
  error?: string | null;
}

export const VideoPlayerContainer: React.FC<VideoPlayerContainerProps> = ({
  content,
  showBackButton = true,
  onBack,
  autoplay = false,
  className = '',
  loading = false,
  error = null
}) => {
  const router = useRouter();
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout>();

  // Determine video source and type
  const getVideoSource = () => {
    if (content.youtube_id) {
      return { src: content.youtube_id, type: 'youtube' as const };
    } else if (content.vimeo_id) {
      return { src: content.vimeo_id, type: 'vimeo' as const };
    } else if (content.video_url) {
      return { src: content.video_url, type: 'direct' as const };
    }
    return null;
  };

  const videoSource = getVideoSource();

  // Progress tracking
  const {
    progress,
    isLoading: progressLoading,
    isSaving,
    error: progressError,
    updateProgress,
    markCompleted,
    saveProgress
  } = useVideoProgress({
    contentId: content.id,
    saveInterval: 10000, // Save every 10 seconds
    minProgressChange: 5, // Save when 5+ seconds change
    completionThreshold: 90, // Mark complete at 90%
    autoSave: true
  });

  // Handle back navigation
  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  }, [onBack, router]);

  // Handle previous episode
  const handlePrevious = useCallback(() => {
    if (content.previous_episode_id) {
      // Save current progress before navigating
      saveProgress();
      router.push(`/watch/${content.previous_episode_id}`);
    }
  }, [content.previous_episode_id, router, saveProgress]);

  // Handle next episode
  const handleNext = useCallback(() => {
    if (content.next_episode_id) {
      // Save current progress before navigating
      saveProgress();
      router.push(`/watch/${content.next_episode_id}`);
    }
  }, [content.next_episode_id, router, saveProgress]);

  // Handle time updates from video player
  const handleTimeUpdate = useCallback((currentTime: number, duration: number) => {
    updateProgress(currentTime, duration);
  }, [updateProgress]);

  // Handle video end
  const handleVideoEnd = useCallback(() => {
    markCompleted();
    
    // Auto-play next episode if available
    if (content.next_episode_id) {
      setTimeout(() => {
        router.push(`/watch/${content.next_episode_id}`);
      }, 3000); // 3 second delay
    }
  }, [markCompleted, content.next_episode_id, router]);

  // Handle mouse movement for controls
  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }
    
    const timeout = setTimeout(() => {
      setShowControls(false);
    }, 3000);
    
    setControlsTimeout(timeout);
  }, [controlsTimeout]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, [controlsTimeout]);

  // Save progress when leaving page
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveProgress();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      saveProgress();
    };
  }, [saveProgress]);

  // Show loading state
  if (loading || progressLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="xl" label="Loading video..." />
      </div>
    );
  }

  // Show error state
  if (error || progressError) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Error Loading Video</h2>
          <p className="text-gray-400 mb-4">{error || progressError}</p>
          <button
            onClick={handleBack}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Show no video available
  if (!videoSource) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">No Video Available</h2>
          <p className="text-gray-400 mb-4">This content doesn't have a video source.</p>
          <button
            onClick={handleBack}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`min-h-screen bg-black ${className}`}
      onMouseMove={handleMouseMove}
    >
      {/* Video Player */}
      <div className="relative w-full h-screen">
        <VideoPlayer
          src={videoSource.src}
          type={videoSource.type}
          title={content.title}
          startTime={progress?.watchedSeconds || content.watched_seconds || 0}
          autoplay={autoplay}
          controls={videoSource.type === 'direct'}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnd}
          onPrevious={content.previous_episode_id ? handlePrevious : undefined}
          onNext={content.next_episode_id ? handleNext : undefined}
          qualities={content.qualities}
          className="w-full h-full"
        />

        {/* Top Overlay with Back Button and Title */}
        <div className={`absolute top-0 left-0 right-0 z-10 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
          <div className="bg-gradient-to-b from-black/70 to-transparent p-6">
            <div className="flex items-center space-x-4">
              {showBackButton && (
                <button
                  onClick={handleBack}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Go back"
                >
                  <ArrowLeft className="h-6 w-6 text-white" />
                </button>
              )}
              <div className="flex-1">
                <h1 className="text-xl font-semibold text-white">{content.title}</h1>
                {content.series_name && (
                  <p className="text-gray-300">
                    {content.series_name}
                    {content.episode_number && ` • Episode ${content.episode_number}`}
                  </p>
                )}
                {content.creator_name && (
                  <p className="text-gray-400 text-sm">by {content.creator_name}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        {progress && progress.progressPercentage > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
            <div 
              className="h-full bg-red-600 transition-all duration-300"
              style={{ width: `${progress.progressPercentage}%` }}
            />
          </div>
        )}

        {/* Saving Indicator */}
        {isSaving && (
          <div className="absolute top-4 right-4 bg-black/70 rounded-lg px-3 py-2">
            <div className="flex items-center space-x-2">
              <LoadingSpinner size="sm" />
              <span className="text-white text-sm">Saving...</span>
            </div>
          </div>
        )}

        {/* Episode Navigation Hints */}
        {(content.previous_episode_id || content.next_episode_id) && (
          <div className={`absolute bottom-20 left-6 right-6 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}>
            <div className="flex justify-between">
              {content.previous_episode_id && (
                <button
                  onClick={handlePrevious}
                  className="bg-black/70 hover:bg-black/90 rounded-lg px-4 py-2 text-white text-sm transition-colors"
                >
                  ← Previous Episode
                </button>
              )}
              {content.next_episode_id && (
                <button
                  onClick={handleNext}
                  className="bg-black/70 hover:bg-black/90 rounded-lg px-4 py-2 text-white text-sm transition-colors ml-auto"
                >
                  Next Episode →
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Video Description (if available) */}
      {content.description && (
        <div className="p-6 bg-gray-900">
          <h3 className="text-lg font-semibold text-white mb-2">About this video</h3>
          <p className="text-gray-300 leading-relaxed">{content.description}</p>
        </div>
      )}
    </div>
  );
};

export default VideoPlayerContainer;