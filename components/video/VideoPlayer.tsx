'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward, Settings, Loader2 } from 'lucide-react';

export interface VideoPlayerProps {
  /** Video source - can be YouTube ID, Vimeo ID, or direct URL */
  src: string;
  /** Type of video source */
  type: 'youtube' | 'vimeo' | 'direct';
  /** Video title */
  title?: string;
  /** Initial playback position in seconds */
  startTime?: number;
  /** Whether to autoplay the video */
  autoplay?: boolean;
  /** Whether to show controls */
  controls?: boolean;
  /** Whether to loop the video */
  loop?: boolean;
  /** Whether to mute the video initially */
  muted?: boolean;
  /** Callback when play state changes */
  onPlayStateChange?: (isPlaying: boolean) => void;
  /** Callback when time updates */
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  /** Callback when video ends */
  onEnded?: () => void;
  /** Callback when video is ready */
  onReady?: (duration: number) => void;
  /** Callback when seeking */
  onSeek?: (time: number) => void;
  /** Custom CSS classes */
  className?: string;
  /** Whether to show loading state */
  loading?: boolean;
  /** Previous episode callback */
  onPrevious?: () => void;
  /** Next episode callback */
  onNext?: () => void;
  /** Quality options for direct videos */
  qualities?: Array<{ label: string; src: string }>;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  type,
  title,
  startTime = 0,
  autoplay = false,
  controls = true,
  loop = false,
  muted = false,
  onPlayStateChange,
  onTimeUpdate,
  onEnded,
  onReady,
  onSeek,
  className = '',
  loading = false,
  onPrevious,
  onNext,
  qualities = []
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(startTime);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(muted ? 0 : 1);
  const [isMuted, setIsMuted] = useState(muted);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState(qualities[0]?.src || src);
  const [showQualityMenu, setShowQualityMenu] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const progressUpdateRef = useRef<NodeJS.Timeout>();

  // Handle play/pause
  const handlePlayPause = useCallback(() => {
    if (type === 'direct' && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    } else if (type === 'youtube' || type === 'vimeo') {
      // For embedded players, we'll need to use their APIs
      // This is a simplified version - in production you'd use YouTube/Vimeo APIs
      setIsPlaying(!isPlaying);
      onPlayStateChange?.(!isPlaying);
    }
  }, [isPlaying, type, onPlayStateChange]);

  // Handle volume change
  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
    }
  }, []);

  // Handle mute toggle
  const handleMuteToggle = useCallback(() => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (videoRef.current) {
      videoRef.current.muted = newMuted;
    }
    if (newMuted) {
      setVolume(0);
    } else {
      setVolume(videoRef.current?.volume || 1);
    }
  }, [isMuted]);

  // Handle seek
  const handleSeek = useCallback((time: number) => {
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
    onSeek?.(time);
  }, [onSeek]);

  // Handle fullscreen toggle
  const handleFullscreenToggle = useCallback(() => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, [isFullscreen]);

  // Handle quality change
  const handleQualityChange = useCallback((qualitySrc: string) => {
    if (videoRef.current) {
      const wasPlaying = !videoRef.current.paused;
      const currentTimeBackup = videoRef.current.currentTime;
      
      setSelectedQuality(qualitySrc);
      
      // Wait for new source to load, then restore position
      const handleLoadedData = () => {
        if (videoRef.current) {
          videoRef.current.currentTime = currentTimeBackup;
          if (wasPlaying) {
            videoRef.current.play();
          }
          videoRef.current.removeEventListener('loadeddata', handleLoadedData);
        }
      };
      
      videoRef.current.addEventListener('loadeddata', handleLoadedData);
    }
    setShowQualityMenu(false);
  }, []);

  // Handle mouse movement for controls
  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  }, [isPlaying]);

  // Format time display
  const formatTime = useCallback((seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
  }, []);

  // Handle video events for direct videos
  useEffect(() => {
    const video = videoRef.current;
    if (!video || type !== 'direct') return;

    const handlePlay = () => {
      setIsPlaying(true);
      setIsBuffering(false);
      onPlayStateChange?.(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
      onPlayStateChange?.(false);
    };

    const handleTimeUpdate = () => {
      const current = video.currentTime;
      setCurrentTime(current);
      onTimeUpdate?.(current, video.duration);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      onReady?.(video.duration);
      if (startTime > 0) {
        video.currentTime = startTime;
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onEnded?.();
    };

    const handleWaiting = () => {
      setIsBuffering(true);
    };

    const handleCanPlay = () => {
      setIsBuffering(false);
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [type, startTime, onPlayStateChange, onTimeUpdate, onReady, onEnded]);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      if (progressUpdateRef.current) {
        clearTimeout(progressUpdateRef.current);
      }
    };
  }, []);

  // Render video player based on type
  const renderPlayer = () => {
    if (loading) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <Loader2 className="h-12 w-12 text-white animate-spin" />
        </div>
      );
    }

    switch (type) {
      case 'youtube':
        return (
          <iframe
            ref={iframeRef}
            src={`https://www.youtube.com/embed/${src}?autoplay=${autoplay ? 1 : 0}&start=${Math.floor(startTime)}&controls=${controls ? 1 : 0}&loop=${loop ? 1 : 0}&mute=${muted ? 1 : 0}`}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={title}
          />
        );

      case 'vimeo':
        return (
          <iframe
            ref={iframeRef}
            src={`https://player.vimeo.com/video/${src}?autoplay=${autoplay ? 1 : 0}&loop=${loop ? 1 : 0}&muted=${muted ? 1 : 0}#t=${Math.floor(startTime)}s`}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={title}
          />
        );

      case 'direct':
        return (
          <video
            ref={videoRef}
            src={selectedQuality}
            className="absolute inset-0 w-full h-full object-contain"
            autoPlay={autoplay}
            loop={loop}
            muted={muted}
            playsInline
          />
        );

      default:
        return (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <p className="text-gray-400">Unsupported video type</p>
          </div>
        );
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative bg-black ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
      role="region"
      aria-label={title ? `Video player: ${title}` : 'Video player'}
    >
      {/* Video Player */}
      {renderPlayer()}

      {/* Buffering Indicator */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Loader2 className="h-8 w-8 text-white animate-spin" />
        </div>
      )}

      {/* Controls Overlay */}
      {controls && (
        <div className={`absolute inset-0 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          {/* Top Bar */}
          {title && (
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4">
              <h2 className="text-white text-lg font-semibold">{title}</h2>
            </div>
          )}

          {/* Center Play Button */}
          {!isPlaying && !isBuffering && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={handlePlayPause}
                className="p-4 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                aria-label="Play video"
              >
                <Play className="h-12 w-12 text-white" fill="white" />
              </button>
            </div>
          )}

          {/* Bottom Controls */}
          {type === 'direct' && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              {/* Progress Bar */}
              <div className="mb-4">
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={(e) => handleSeek(parseFloat(e.target.value))}
                  className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #dc2626 0%, #dc2626 ${(currentTime / duration) * 100}%, #4b5563 ${(currentTime / duration) * 100}%, #4b5563 100%)`
                  }}
                  aria-label="Video progress"
                />
                <div className="flex justify-between text-xs text-gray-300 mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {/* Play/Pause */}
                  <button
                    onClick={handlePlayPause}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5 text-white" fill="white" />
                    ) : (
                      <Play className="h-5 w-5 text-white" fill="white" />
                    )}
                  </button>

                  {/* Previous/Next */}
                  {onPrevious && (
                    <button
                      onClick={onPrevious}
                      className="p-2 hover:bg-white/20 rounded-full transition-colors"
                      aria-label="Previous episode"
                    >
                      <SkipBack className="h-4 w-4 text-white" />
                    </button>
                  )}
                  {onNext && (
                    <button
                      onClick={onNext}
                      className="p-2 hover:bg-white/20 rounded-full transition-colors"
                      aria-label="Next episode"
                    >
                      <SkipForward className="h-4 w-4 text-white" />
                    </button>
                  )}

                  {/* Volume */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleMuteToggle}
                      className="p-2 hover:bg-white/20 rounded-full transition-colors"
                      aria-label={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? (
                        <VolumeX className="h-4 w-4 text-white" />
                      ) : (
                        <Volume2 className="h-4 w-4 text-white" />
                      )}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      className="w-16 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                      aria-label="Volume"
                    />
                  </div>

                  {/* Time Display */}
                  <span className="text-sm text-gray-300">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Quality Selector */}
                  {qualities.length > 0 && (
                    <div className="relative">
                      <button
                        onClick={() => setShowQualityMenu(!showQualityMenu)}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                        aria-label="Video quality"
                      >
                        <Settings className="h-4 w-4 text-white" />
                      </button>
                      {showQualityMenu && (
                        <div className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg py-2 min-w-24">
                          {qualities.map((quality) => (
                            <button
                              key={quality.src}
                              onClick={() => handleQualityChange(quality.src)}
                              className={`block w-full px-4 py-2 text-left text-sm hover:bg-white/20 transition-colors ${
                                selectedQuality === quality.src ? 'text-red-500' : 'text-white'
                              }`}
                            >
                              {quality.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Fullscreen */}
                  <button
                    onClick={handleFullscreenToggle}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                  >
                    <Maximize className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;