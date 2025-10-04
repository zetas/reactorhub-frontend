'use client';

import { ContentSummary } from '@/lib/services/browse';
import { Play, Info, Volume2, VolumeX } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface HeroBannerProps {
  content: ContentSummary;
  onPlay: () => void;
  onMoreInfo: () => void;
  onPreviewStart?: (content: ContentSummary) => void;
  onPreviewStop?: () => void;
  onPreload?: (content: ContentSummary) => void;
  onMuteToggle?: () => void;
  isPreviewPlaying?: boolean;
  isMuted?: boolean;
}

export default function HeroBanner({ 
  content, 
  onPlay, 
  onMoreInfo, 
  onPreviewStart,
  onPreviewStop,
  onPreload,
  onMuteToggle,
  isPreviewPlaying = false,
  isMuted = false
}: HeroBannerProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [localMuted, setLocalMuted] = useState(isMuted);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const backgroundImage = content.thumbnail ? { backgroundImage: `url(${content.thumbnail})` } : undefined;
  const hasProgress = content.progress && content.progress > 0;
  const progressPercentage = hasProgress ? Math.round(content.progress * 100) : 0;

  // Handle hover effects for auto-play preview
  const handleMouseEnter = () => {
    setIsHovered(true);
    
    // Preload video immediately on hover
    if (onPreload) {
      onPreload(content);
    }
    
    // Start auto-play preview after 2 second delay
    hoverTimeoutRef.current = setTimeout(() => {
      if (onPreviewStart) {
        onPreviewStart(content);
      }
    }, 2000);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    
    // Clear the timeout if user leaves before auto-play starts
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    
    // Stop preview if it's playing
    if (onPreviewStop) {
      onPreviewStop();
    }
  };

  const handleMuteToggle = () => {
    setLocalMuted(!localMuted);
    if (onMuteToggle) {
      onMuteToggle();
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Update local muted state when prop changes
  useEffect(() => {
    setLocalMuted(isMuted);
  }, [isMuted]);

  return (
    <section
      className="relative h-[65vh] min-h-[420px] w-full overflow-hidden"
      aria-labelledby="hero-heading"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={backgroundImage}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

      <div className="relative h-full flex items-end pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl space-y-4">
            <p className="text-sm uppercase tracking-[0.4em] text-red-400">Featured</p>
            <h1 id="hero-heading" className="text-5xl sm:text-6xl font-bold leading-tight">
              {content.title}
            </h1>
            <div className="text-gray-300 space-y-1 text-lg">
              {content.seriesName && (
                <p>{content.seriesName}</p>
              )}
              {content.episodeLabel && (
                <p className="text-gray-400">{content.episodeLabel}</p>
              )}
              {content.creatorName && (
                <p className="text-gray-400">by {content.creatorName}</p>
              )}
            </div>
            {/* Progress bar */}
            {hasProgress && (
              <div className="w-full max-w-md mb-4">
                <div className="h-1 bg-gray-600 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-600 transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                    data-testid="progress-bar"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={onPlay}
                className="inline-flex items-center rounded-full bg-white px-6 py-3 text-base font-semibold text-black shadow transition hover:bg-gray-200"
              >
                <Play className="mr-2 h-5 w-5" aria-hidden />
                {hasProgress ? 'Continue Watching' : 'Play'}
              </button>
              <button
                type="button"
                onClick={onMoreInfo}
                className="inline-flex items-center rounded-full border border-gray-500 px-6 py-3 text-base font-semibold text-white transition hover:border-white/80 hover:text-white"
              >
                <Info className="mr-2 h-5 w-5" aria-hidden />
                More Info
              </button>
              
              {/* Mute button - only show during preview */}
              {isPreviewPlaying && (
                <button
                  type="button"
                  onClick={handleMuteToggle}
                  className="inline-flex items-center rounded-full border border-gray-500 p-3 text-white transition hover:border-white/80 hover:text-white"
                  aria-label={localMuted ? 'Unmute' : 'Mute'}
                >
                  {localMuted ? (
                    <VolumeX className="h-5 w-5" aria-hidden />
                  ) : (
                    <Volume2 className="h-5 w-5" aria-hidden />
                  )}
                </button>
              )}
              
              {content.durationLabel && (
                <span className="text-sm text-gray-300">{content.durationLabel}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
