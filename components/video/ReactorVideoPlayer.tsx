'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Settings,
  SkipBack,
  SkipForward,
  RotateCcw
} from 'lucide-react';

interface VideoPlayerProps {
  url: string;
  title: string;
  thumbnail?: string;
  onProgress?: (progress: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => void;
  onEnded?: () => void;
  startTime?: number;
  className?: string;
}

export default function ReactorVideoPlayer({
  url,
  title,
  thumbnail,
  onProgress,
  onEnded,
  startTime = 0,
  className = ''
}: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  
  const playerRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Auto-hide controls after 3 seconds of inactivity
  useEffect(() => {
    if (playing && showControls) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [playing, showControls]);

  // Handle play/pause with HTML5 video
  useEffect(() => {
    if (playerRef.current) {
      if (playing) {
        playerRef.current.play().catch(console.error);
      } else {
        playerRef.current.pause();
      }
    }
  }, [playing]);

  // Handle volume changes
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.volume = volume;
      playerRef.current.muted = muted;
    }
  }, [volume, muted]);

  // Handle playback rate changes
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleProgress = (progress: any) => {
    if (!seeking) {
      setPlayed(progress.played);
      setLoaded(progress.loaded);
    }
    onProgress?.(progress);
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayed(parseFloat(e.target.value));
  };

  const handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    setSeeking(false);
    if (playerRef.current) {
      const target = e.target as HTMLInputElement;
      playerRef.current.currentTime = parseFloat(target.value) * duration;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
    setMuted(false);
  };

  const handleMute = () => {
    setMuted(!muted);
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  const handleSkip = (seconds: number) => {
    if (playerRef.current) {
      const currentTime = playerRef.current.currentTime;
      playerRef.current.currentTime = currentTime + seconds;
    }
  };

  const formatTime = (seconds: number) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative bg-black rounded-lg overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      {/* Video Player */}
      <video
        ref={playerRef}
        src={url}
        className="w-full h-full object-contain"
        onLoadedMetadata={() => {
          if (startTime > 0 && playerRef.current) {
            playerRef.current.currentTime = startTime;
          }
          if (playerRef.current) {
            setDuration(playerRef.current.duration);
          }
        }}
        onTimeUpdate={() => {
          if (playerRef.current) {
            const progress = {
              played: playerRef.current.currentTime / playerRef.current.duration,
              playedSeconds: playerRef.current.currentTime,
              loaded: playerRef.current.buffered.length > 0 ? 
                playerRef.current.buffered.end(playerRef.current.buffered.length - 1) / playerRef.current.duration : 0,
              loadedSeconds: playerRef.current.buffered.length > 0 ? 
                playerRef.current.buffered.end(playerRef.current.buffered.length - 1) : 0
            };
            handleProgress(progress);
          }
        }}
        onEnded={onEnded}
        onVolumeChange={() => {
          if (playerRef.current) {
            setVolume(playerRef.current.volume);
            setMuted(playerRef.current.muted);
          }
        }}
      />

      {/* Loading Overlay */}
      {!playing && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <button
            onClick={handlePlayPause}
            className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4 transition-colors"
          >
            <Play className="h-8 w-8 ml-1" />
          </button>
        </div>
      )}

      {/* Custom Controls */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Progress Bar */}
        <div className="mb-4">
          <input
            type="range"
            min={0}
            max={1}
            step="any"
            value={played}
            onMouseDown={handleSeekMouseDown}
            onChange={handleSeekChange}
            onMouseUp={handleSeekMouseUp}
            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${played * 100}%, #4b5563 ${played * 100}%, #4b5563 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-gray-300 mt-1">
            <span>{formatTime(duration * played)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Play/Pause */}
            <button
              onClick={handlePlayPause}
              className="text-white hover:text-red-400 transition-colors"
            >
              {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </button>

            {/* Skip Buttons */}
            <button
              onClick={() => handleSkip(-10)}
              className="text-white hover:text-red-400 transition-colors"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleSkip(10)}
              className="text-white hover:text-red-400 transition-colors"
            >
              <SkipForward className="h-5 w-5" />
            </button>

            {/* Volume Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleMute}
                className="text-white hover:text-red-400 transition-colors"
              >
                {muted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={muted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Playback Speed */}
            <select
              value={playbackRate}
              onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
              className="bg-gray-800 text-white text-sm rounded px-2 py-1 border border-gray-600"
            >
              <option value={0.5}>0.5x</option>
              <option value={0.75}>0.75x</option>
              <option value={1}>1x</option>
              <option value={1.25}>1.25x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </select>
          </div>

          <div className="flex items-center space-x-4">
            {/* Settings */}
            <button className="text-white hover:text-red-400 transition-colors">
              <Settings className="h-5 w-5" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={handleFullscreen}
              className="text-white hover:text-red-400 transition-colors"
            >
              <Maximize className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Title Overlay */}
      <div 
        className={`absolute top-0 left-0 right-0 bg-gradient-to-b from-black via-black/80 to-transparent p-4 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <h2 className="text-white text-lg font-semibold truncate">{title}</h2>
      </div>
    </div>
  );
}