import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import VideoPlayer from '@/components/netflix/VideoPlayer';

// Mock video element
const mockVideoElement = {
  play: jest.fn().mockResolvedValue(undefined),
  pause: jest.fn(),
  load: jest.fn(),
  currentTime: 0,
  duration: 100,
  volume: 1,
  muted: false,
  paused: true,
  ended: false,
  readyState: 4,
  buffered: {
    length: 1,
    start: () => 0,
    end: () => 50,
  },
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  requestFullscreen: jest.fn(),
  exitFullscreen: jest.fn(),
};

// Mock HTMLVideoElement
Object.defineProperty(HTMLMediaElement.prototype, 'play', {
  writable: true,
  value: jest.fn().mockResolvedValue(undefined),
});

Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
  writable: true,
  value: jest.fn(),
});

Object.defineProperty(HTMLMediaElement.prototype, 'load', {
  writable: true,
  value: jest.fn(),
});

// Mock fullscreen API
Object.defineProperty(document, 'fullscreenElement', {
  writable: true,
  value: null,
});

Object.defineProperty(document, 'exitFullscreen', {
  writable: true,
  value: jest.fn().mockResolvedValue(undefined),
});

const mockVideoProps = {
  src: 'https://example.com/video.mp4',
  poster: 'https://example.com/poster.jpg',
  title: 'Breaking Bad S01E01 - Pilot',
  onTimeUpdate: jest.fn(),
  onEnded: jest.fn(),
  onError: jest.fn(),
  onPlay: jest.fn(),
  onPause: jest.fn(),
  onVolumeChange: jest.fn(),
  onFullscreenChange: jest.fn(),
  onProgress: jest.fn(),
};

describe('VideoPlayer Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset video element properties
    Object.defineProperty(HTMLVideoElement.prototype, 'currentTime', {
      writable: true,
      value: 0,
    });
    
    Object.defineProperty(HTMLVideoElement.prototype, 'duration', {
      writable: true,
      value: 100,
    });
    
    Object.defineProperty(HTMLVideoElement.prototype, 'volume', {
      writable: true,
      value: 1,
    });
    
    Object.defineProperty(HTMLVideoElement.prototype, 'muted', {
      writable: true,
      value: false,
    });
    
    Object.defineProperty(HTMLVideoElement.prototype, 'paused', {
      writable: true,
      value: true,
    });
  });

  describe('Basic Rendering', () => {
    it('renders video player with controls', () => {
      render(<VideoPlayer {...mockVideoProps} />);

      expect(screen.getByRole('application', { name: /video player/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
      expect(screen.getByRole('slider', { name: /progress/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /mute/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /fullscreen/i })).toBeInTheDocument();
    });

    it('displays video title', () => {
      render(<VideoPlayer {...mockVideoProps} />);
      expect(screen.getByText('Breaking Bad S01E01 - Pilot')).toBeInTheDocument();
    });

    it('shows poster image when video is not playing', () => {
      render(<VideoPlayer {...mockVideoProps} />);
      const video = screen.getByRole('application').querySelector('video');
      expect(video).toHaveAttribute('poster', 'https://example.com/poster.jpg');
    });

    it('applies correct video source', () => {
      render(<VideoPlayer {...mockVideoProps} />);
      const video = screen.getByRole('application').querySelector('video');
      expect(video).toHaveAttribute('src', 'https://example.com/video.mp4');
    });
  });

  describe('Play/Pause Controls', () => {
    it('plays video when play button is clicked', async () => {
      render(<VideoPlayer {...mockVideoProps} />);
      
      const video = screen.getByRole('application').querySelector('video');
      const playButton = screen.getByRole('button', { name: /play/i });
      
      await act(async () => {
        fireEvent.click(playButton);
        // Simulate the video play event
        Object.defineProperty(video, 'paused', { value: false, writable: true });
        fireEvent(video, new Event('play'));
      });

      expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
      expect(mockVideoProps.onPlay).toHaveBeenCalled();
    });

    it('pauses video when pause button is clicked', async () => {
      render(<VideoPlayer {...mockVideoProps} />);
      
      const video = screen.getByRole('application').querySelector('video');
      
      // First play the video
      const playButton = screen.getByRole('button', { name: /play/i });
      await act(async () => {
        fireEvent.click(playButton);
        Object.defineProperty(video, 'paused', { value: false, writable: true });
        fireEvent(video, new Event('play'));
      });

      // Then pause it
      const pauseButton = screen.getByRole('button', { name: /pause/i });
      await act(async () => {
        fireEvent.click(pauseButton);
        Object.defineProperty(video, 'paused', { value: true, writable: true });
        fireEvent(video, new Event('pause'));
      });

      expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
      expect(mockVideoProps.onPause).toHaveBeenCalled();
    });

    it('toggles play/pause with spacebar', async () => {
      render(<VideoPlayer {...mockVideoProps} />);
      
      const player = screen.getByRole('application');
      await act(async () => {
        fireEvent.keyDown(player, { key: ' ', code: 'Space' });
      });

      expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
    });

    it('shows correct play/pause icon based on state', async () => {
      render(<VideoPlayer {...mockVideoProps} />);
      
      const video = screen.getByRole('application').querySelector('video');
      
      // Initially should show play icon
      expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
      
      // After clicking play, should show pause icon
      const playButton = screen.getByRole('button', { name: /play/i });
      await act(async () => {
        fireEvent.click(playButton);
        Object.defineProperty(video, 'paused', { value: false, writable: true });
        fireEvent(video, new Event('play'));
      });

      expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
    });
  });

  describe('Progress Control', () => {
    it('displays current time and duration', () => {
      render(<VideoPlayer {...mockVideoProps} />);
      
      expect(screen.getByText('0:00 / 1:40')).toBeInTheDocument(); // 100 seconds = 1:40
    });

    it('updates progress bar when video time changes', async () => {
      render(<VideoPlayer {...mockVideoProps} />);
      
      const video = screen.getByRole('application').querySelector('video');
      
      // Simulate time update
      Object.defineProperty(video, 'currentTime', { value: 25, writable: true });
      
      await act(async () => {
        fireEvent(video, new Event('timeupdate'));
      });

      const progressSlider = screen.getByRole('slider', { name: /progress/i });
      expect(progressSlider).toHaveValue('25');
    });

    it('seeks to position when progress bar is clicked', async () => {
      render(<VideoPlayer {...mockVideoProps} />);
      
      const progressSlider = screen.getByRole('slider', { name: /progress/i });
      
      await act(async () => {
        fireEvent.change(progressSlider, { target: { value: '50' } });
      });

      const video = screen.getByRole('application').querySelector('video');
      expect(video.currentTime).toBe(50);
    });

    it('shows buffer progress', async () => {
      render(<VideoPlayer {...mockVideoProps} />);
      
      const video = screen.getByRole('application').querySelector('video');
      
      // Mock buffered property
      Object.defineProperty(video, 'buffered', {
        value: {
          length: 1,
          start: () => 0,
          end: () => 50,
        },
        writable: true,
      });
      
      await act(async () => {
        fireEvent(video, new Event('progress'));
      });

      const bufferBar = screen.getByTestId('buffer-progress');
      expect(bufferBar).toBeInTheDocument();
      expect(bufferBar).toHaveStyle('width: 50%'); // 50 out of 100 seconds buffered
    });

    it('calls onTimeUpdate callback', async () => {
      render(<VideoPlayer {...mockVideoProps} />);
      
      const video = screen.getByRole('application').querySelector('video');
      
      await act(async () => {
        fireEvent(video, new Event('timeupdate'));
      });

      expect(mockVideoProps.onTimeUpdate).toHaveBeenCalled();
    });
  });

  describe('Volume Control', () => {
    it('toggles mute when mute button is clicked', async () => {
      render(<VideoPlayer {...mockVideoProps} />);
      
      const video = screen.getByRole('application').querySelector('video');
      const muteButton = screen.getByRole('button', { name: /mute/i });
      
      await act(async () => {
        fireEvent.click(muteButton);
        Object.defineProperty(video, 'muted', { value: true, writable: true });
        fireEvent(video, new Event('volumechange'));
      });

      expect(video.muted).toBe(true);
      expect(mockVideoProps.onVolumeChange).toHaveBeenCalled();
    });

    it('shows volume slider on hover', async () => {
      render(<VideoPlayer {...mockVideoProps} />);
      
      const volumeContainer = screen.getByTestId('volume-container');
      
      await act(async () => {
        fireEvent.mouseEnter(volumeContainer);
      });

      expect(screen.getByRole('slider', { name: /volume/i })).toBeInTheDocument();
    });

    it('adjusts volume when volume slider is changed', async () => {
      render(<VideoPlayer {...mockVideoProps} />);
      
      const volumeContainer = screen.getByTestId('volume-container');
      await act(async () => {
        fireEvent.mouseEnter(volumeContainer);
      });

      const volumeSlider = screen.getByRole('slider', { name: /volume/i });
      await act(async () => {
        fireEvent.change(volumeSlider, { target: { value: '0.5' } });
      });

      const video = screen.getByRole('application').querySelector('video');
      expect(video.volume).toBe(0.5);
    });

    it('shows correct mute/unmute icon', async () => {
      render(<VideoPlayer {...mockVideoProps} />);
      
      const video = screen.getByRole('application').querySelector('video');
      
      // Initially should show mute icon (volume on)
      expect(screen.getByRole('button', { name: /mute/i })).toBeInTheDocument();
      
      // After muting, should show unmute icon
      const muteButton = screen.getByRole('button', { name: /mute/i });
      await act(async () => {
        fireEvent.click(muteButton);
        Object.defineProperty(video, 'muted', { value: true, writable: true });
        fireEvent(video, new Event('volumechange'));
      });

      expect(screen.getByRole('button', { name: /unmute/i })).toBeInTheDocument();
    });
  });

  describe('Fullscreen Control', () => {
    it('enters fullscreen when fullscreen button is clicked', async () => {
      render(<VideoPlayer {...mockVideoProps} />);
      
      const fullscreenButton = screen.getByRole('button', { name: /fullscreen/i });
      
      // Mock requestFullscreen
      const mockRequestFullscreen = jest.fn().mockResolvedValue(undefined);
      const player = screen.getByRole('application');
      player.requestFullscreen = mockRequestFullscreen;

      await act(async () => {
        fireEvent.click(fullscreenButton);
      });

      expect(mockRequestFullscreen).toHaveBeenCalled();
    });

    it('exits fullscreen when already in fullscreen', async () => {
      render(<VideoPlayer {...mockVideoProps} />);
      
      const player = screen.getByRole('application');
      
      // Mock fullscreen state
      Object.defineProperty(document, 'fullscreenElement', {
        writable: true,
        value: player,
      });

      // Trigger fullscreen change to update component state
      await act(async () => {
        fireEvent(document, new Event('fullscreenchange'));
      });
      
      const exitFullscreenButton = screen.getByRole('button', { name: /exit fullscreen/i });
      await act(async () => {
        fireEvent.click(exitFullscreenButton);
      });

      expect(document.exitFullscreen).toHaveBeenCalled();
    });

    it('toggles fullscreen with F key', async () => {
      render(<VideoPlayer {...mockVideoProps} />);
      
      const player = screen.getByRole('application');
      const mockRequestFullscreen = jest.fn().mockResolvedValue(undefined);
      player.requestFullscreen = mockRequestFullscreen;

      await act(async () => {
        fireEvent.keyDown(player, { key: 'f', code: 'KeyF' });
      });

      expect(mockRequestFullscreen).toHaveBeenCalled();
    });
  });

  describe('Keyboard Controls', () => {
    it('seeks forward with right arrow key', async () => {
      render(<VideoPlayer {...mockVideoProps} />);
      
      const player = screen.getByRole('application');
      const video = player.querySelector('video');
      
      // Set initial time
      Object.defineProperty(video, 'currentTime', { value: 0, writable: true });
      
      await act(async () => {
        fireEvent.keyDown(player, { key: 'ArrowRight', code: 'ArrowRight' });
      });

      expect(video.currentTime).toBe(10); // Default seek amount
    });

    it('seeks backward with left arrow key', async () => {
      render(<VideoPlayer {...mockVideoProps} />);
      
      const player = screen.getByRole('application');
      const video = player.querySelector('video');
      
      // Set initial time
      Object.defineProperty(video, 'currentTime', { value: 20, writable: true });
      
      await act(async () => {
        fireEvent.keyDown(player, { key: 'ArrowLeft', code: 'ArrowLeft' });
      });

      expect(video.currentTime).toBe(10);
    });

    it('increases volume with up arrow key', async () => {
      render(<VideoPlayer {...mockVideoProps} />);
      
      const player = screen.getByRole('application');
      const video = player.querySelector('video');
      
      await act(async () => {
        fireEvent.keyDown(player, { key: 'ArrowUp', code: 'ArrowUp' });
      });

      expect(video.volume).toBe(1); // Already at max
    });

    it('decreases volume with down arrow key', async () => {
      render(<VideoPlayer {...mockVideoProps} />);
      
      const player = screen.getByRole('application');
      const video = player.querySelector('video');
      
      await act(async () => {
        fireEvent.keyDown(player, { key: 'ArrowDown', code: 'ArrowDown' });
      });

      expect(video.volume).toBe(0.9);
    });

    it('toggles mute with M key', async () => {
      render(<VideoPlayer {...mockVideoProps} />);
      
      const player = screen.getByRole('application');
      const video = player.querySelector('video');
      
      await act(async () => {
        fireEvent.keyDown(player, { key: 'm', code: 'KeyM' });
      });

      expect(video.muted).toBe(true);
    });
  });

  describe('Loading and Error States', () => {
    it('shows loading spinner when video is loading', () => {
      render(<VideoPlayer {...mockVideoProps} isLoading={true} />);
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('shows error message when video fails to load', () => {
      render(<VideoPlayer {...mockVideoProps} error="Failed to load video" />);
      expect(screen.getByText(/failed to load video/i)).toBeInTheDocument();
    });

    it('calls onError callback when video error occurs', async () => {
      render(<VideoPlayer {...mockVideoProps} />);
      
      const video = screen.getByRole('application').querySelector('video');
      
      await act(async () => {
        fireEvent(video, new Event('error'));
      });

      expect(mockVideoProps.onError).toHaveBeenCalled();
    });

    it('shows retry button on error', () => {
      render(<VideoPlayer {...mockVideoProps} error="Network error" />);
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });
  });

  describe('Auto-hide Controls', () => {
    it('hides controls after inactivity', async () => {
      jest.useFakeTimers();
      
      render(<VideoPlayer {...mockVideoProps} />);
      
      const video = screen.getByRole('application').querySelector('video');
      const controls = screen.getByTestId('video-controls');
      
      // Start playing to enable auto-hide
      await act(async () => {
        const playButton = screen.getByRole('button', { name: /play/i });
        fireEvent.click(playButton);
        Object.defineProperty(video, 'paused', { value: false, writable: true });
        fireEvent(video, new Event('play'));
      });
      
      expect(controls).not.toHaveClass('opacity-0');
      
      // Simulate inactivity
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      expect(controls).toHaveClass('opacity-0');
      
      jest.useRealTimers();
    });

    it('shows controls on mouse movement', async () => {
      render(<VideoPlayer {...mockVideoProps} />);
      
      const player = screen.getByRole('application');
      
      await act(async () => {
        fireEvent.mouseMove(player);
      });

      const controls = screen.getByTestId('video-controls');
      expect(controls).not.toHaveClass('opacity-0');
    });

    it('keeps controls visible when hovering over them', async () => {
      render(<VideoPlayer {...mockVideoProps} />);
      
      const controls = screen.getByTestId('video-controls');
      
      await act(async () => {
        fireEvent.mouseEnter(controls);
      });

      expect(controls).not.toHaveClass('opacity-0');
    });
  });

  describe('Responsive Design', () => {
    it('adapts controls for mobile devices', async () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 767, // Mobile width
      });

      render(<VideoPlayer {...mockVideoProps} />);
      
      // Trigger resize event to update mobile state
      await act(async () => {
        fireEvent(window, new Event('resize'));
      });
      
      const controls = screen.getByTestId('video-controls');
      expect(controls).toHaveClass('mobile-controls');
    });

    it('shows simplified controls on small screens', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 480,
      });

      render(<VideoPlayer {...mockVideoProps} />);
      
      // Volume slider should be hidden on small screens
      const volumeContainer = screen.getByTestId('volume-container');
      expect(volumeContainer).toHaveClass('hidden', 'sm:block');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(<VideoPlayer {...mockVideoProps} />);
      
      expect(screen.getByRole('application')).toHaveAttribute('aria-label', 'Video player for Breaking Bad S01E01 - Pilot');
      expect(screen.getByRole('slider', { name: /progress/i })).toHaveAttribute('aria-valuemin', '0');
      expect(screen.getByRole('slider', { name: /progress/i })).toHaveAttribute('aria-valuemax', '100');
    });

    it('supports keyboard navigation', () => {
      render(<VideoPlayer {...mockVideoProps} />);
      
      const player = screen.getByRole('application');
      expect(player).toHaveAttribute('tabIndex', '0');
    });

    it('announces time updates to screen readers', async () => {
      render(<VideoPlayer {...mockVideoProps} />);
      
      const timeDisplay = screen.getByTestId('time-display');
      expect(timeDisplay).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Performance Optimizations', () => {
    it('preloads video metadata', () => {
      render(<VideoPlayer {...mockVideoProps} />);
      
      const video = screen.getByRole('application').querySelector('video');
      expect(video).toHaveAttribute('preload', 'metadata');
    });

    it('uses efficient seeking for large videos', async () => {
      render(<VideoPlayer {...mockVideoProps} />);
      
      const progressSlider = screen.getByRole('slider', { name: /progress/i });
      
      // Simulate seeking to multiple positions quickly
      await act(async () => {
        fireEvent.change(progressSlider, { target: { value: '25' } });
        fireEvent.change(progressSlider, { target: { value: '50' } });
        fireEvent.change(progressSlider, { target: { value: '75' } });
      });

      // Should debounce seek operations
      const video = screen.getByRole('application').querySelector('video');
      expect(video.currentTime).toBe(75);
    });
  });
});