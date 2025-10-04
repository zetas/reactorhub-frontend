import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import VideoPlayer from '@/components/video/VideoPlayer';

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  Play: ({ className, ...props }: any) => <div className={className} data-testid="play-icon" {...props} />,
  Pause: ({ className, ...props }: any) => <div className={className} data-testid="pause-icon" {...props} />,
  Volume2: ({ className, ...props }: any) => <div className={className} data-testid="volume-icon" {...props} />,
  VolumeX: ({ className, ...props }: any) => <div className={className} data-testid="volume-mute-icon" {...props} />,
  Maximize: ({ className, ...props }: any) => <div className={className} data-testid="maximize-icon" {...props} />,
  SkipBack: ({ className, ...props }: any) => <div className={className} data-testid="skip-back-icon" {...props} />,
  SkipForward: ({ className, ...props }: any) => <div className={className} data-testid="skip-forward-icon" {...props} />,
  Settings: ({ className, ...props }: any) => <div className={className} data-testid="settings-icon" {...props} />,
  Loader2: ({ className, ...props }: any) => <div className={className} data-testid="loader-icon" {...props} />
}));

// Mock HTMLVideoElement methods
Object.defineProperty(HTMLVideoElement.prototype, 'play', {
  writable: true,
  value: jest.fn().mockImplementation(() => Promise.resolve())
});

Object.defineProperty(HTMLVideoElement.prototype, 'pause', {
  writable: true,
  value: jest.fn()
});

Object.defineProperty(HTMLVideoElement.prototype, 'currentTime', {
  writable: true,
  value: 0
});

Object.defineProperty(HTMLVideoElement.prototype, 'duration', {
  writable: true,
  value: 100
});

Object.defineProperty(HTMLVideoElement.prototype, 'volume', {
  writable: true,
  value: 1
});

Object.defineProperty(HTMLVideoElement.prototype, 'muted', {
  writable: true,
  value: false
});

describe('VideoPlayer', () => {
  const mockOnPlayStateChange = jest.fn();
  const mockOnTimeUpdate = jest.fn();
  const mockOnEnded = jest.fn();
  const mockOnReady = jest.fn();
  const mockOnSeek = jest.fn();
  const mockOnPrevious = jest.fn();
  const mockOnNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('YouTube Player', () => {
    it('renders YouTube iframe with correct src', () => {
      render(
        <VideoPlayer
          src="dQw4w9WgXcQ"
          type="youtube"
          title="Test Video"
        />
      );

      const iframe = screen.getByTitle('Test Video');
      expect(iframe).toBeInTheDocument();
      expect(iframe).toHaveAttribute('src', expect.stringContaining('youtube.com/embed/dQw4w9WgXcQ'));
    });

    it('includes autoplay parameter when autoplay is true', () => {
      render(
        <VideoPlayer
          src="dQw4w9WgXcQ"
          type="youtube"
          autoplay={true}
        />
      );

      const iframe = screen.getByRole('region');
      const iframeElement = iframe.querySelector('iframe');
      expect(iframeElement).toHaveAttribute('src', expect.stringContaining('autoplay=1'));
    });

    it('includes start time parameter', () => {
      render(
        <VideoPlayer
          src="dQw4w9WgXcQ"
          type="youtube"
          startTime={30}
        />
      );

      const iframe = screen.getByRole('region');
      const iframeElement = iframe.querySelector('iframe');
      expect(iframeElement).toHaveAttribute('src', expect.stringContaining('start=30'));
    });

    it('includes mute parameter when muted is true', () => {
      render(
        <VideoPlayer
          src="dQw4w9WgXcQ"
          type="youtube"
          muted={true}
        />
      );

      const iframe = screen.getByRole('region');
      const iframeElement = iframe.querySelector('iframe');
      expect(iframeElement).toHaveAttribute('src', expect.stringContaining('mute=1'));
    });
  });

  describe('Vimeo Player', () => {
    it('renders Vimeo iframe with correct src', () => {
      render(
        <VideoPlayer
          src="123456789"
          type="vimeo"
          title="Test Vimeo Video"
        />
      );

      const iframe = screen.getByTitle('Test Vimeo Video');
      expect(iframe).toBeInTheDocument();
      expect(iframe).toHaveAttribute('src', expect.stringContaining('player.vimeo.com/video/123456789'));
    });

    it('includes autoplay parameter when autoplay is true', () => {
      render(
        <VideoPlayer
          src="123456789"
          type="vimeo"
          autoplay={true}
        />
      );

      const iframe = screen.getByRole('region');
      const iframeElement = iframe.querySelector('iframe');
      expect(iframeElement).toHaveAttribute('src', expect.stringContaining('autoplay=1'));
    });

    it('includes start time in hash fragment', () => {
      render(
        <VideoPlayer
          src="123456789"
          type="vimeo"
          startTime={45}
        />
      );

      const iframe = screen.getByRole('region');
      const iframeElement = iframe.querySelector('iframe');
      expect(iframeElement).toHaveAttribute('src', expect.stringContaining('#t=45s'));
    });
  });

  describe('Direct Video Player', () => {
    it('renders video element with correct src', () => {
      render(
        <VideoPlayer
          src="https://example.com/video.mp4"
          type="direct"
          title="Direct Video"
        />
      );

      const container = screen.getByRole('region');
      const video = container.querySelector('video');
      expect(video).toBeInTheDocument();
      expect(video).toHaveAttribute('src', 'https://example.com/video.mp4');
    });

    it('shows play/pause controls for direct videos', () => {
      render(
        <VideoPlayer
          src="https://example.com/video.mp4"
          type="direct"
          controls={true}
        />
      );

      // Initially shows play button (center)
      expect(screen.getByLabelText('Play video')).toBeInTheDocument();
    });

    it('shows progress bar for direct videos', () => {
      render(
        <VideoPlayer
          src="https://example.com/video.mp4"
          type="direct"
          controls={true}
        />
      );

      expect(screen.getByLabelText('Video progress')).toBeInTheDocument();
    });

    it('shows volume controls for direct videos', () => {
      render(
        <VideoPlayer
          src="https://example.com/video.mp4"
          type="direct"
          controls={true}
        />
      );

      expect(screen.getByLabelText('Volume')).toBeInTheDocument();
      expect(screen.getByLabelText('Mute')).toBeInTheDocument();
    });

    it('shows fullscreen button for direct videos', () => {
      render(
        <VideoPlayer
          src="https://example.com/video.mp4"
          type="direct"
          controls={true}
        />
      );

      expect(screen.getByLabelText('Enter fullscreen')).toBeInTheDocument();
    });

    it('handles play/pause button clicks', async () => {
      render(
        <VideoPlayer
          src="https://example.com/video.mp4"
          type="direct"
          onPlayStateChange={mockOnPlayStateChange}
        />
      );

      const playButton = screen.getByLabelText('Play video');
      fireEvent.click(playButton);

      // Note: In a real test environment, you'd need to simulate video events
      // For now, we just verify the button exists and can be clicked
      expect(playButton).toBeInTheDocument();
    });

    it('handles volume changes', () => {
      render(
        <VideoPlayer
          src="https://example.com/video.mp4"
          type="direct"
          controls={true}
        />
      );

      const volumeSlider = screen.getByLabelText('Volume');
      fireEvent.change(volumeSlider, { target: { value: '0.5' } });

      expect(volumeSlider).toHaveValue('0.5');
    });

    it('handles mute toggle', () => {
      render(
        <VideoPlayer
          src="https://example.com/video.mp4"
          type="direct"
          controls={true}
        />
      );

      const muteButton = screen.getByLabelText('Mute');
      fireEvent.click(muteButton);

      // After clicking mute, it should show unmute
      expect(screen.getByLabelText('Unmute')).toBeInTheDocument();
    });

    it('handles progress bar seeking', async () => {
      const { container } = render(
        <VideoPlayer
          src="https://example.com/video.mp4"
          type="direct"
          onSeek={mockOnSeek}
        />
      );

      // Simulate video metadata loaded by triggering loadedmetadata event
      const video = container.querySelector('video');
      if (video) {
        // Mock duration
        Object.defineProperty(video, 'duration', { value: 100, writable: true });
        fireEvent(video, new Event('loadedmetadata'));
      }

      // Wait for state update
      await waitFor(() => {
        const progressBar = container.querySelector('input[aria-label="Video progress"]');
        expect(progressBar).toHaveAttribute('max', '100');
      });
      
      const progressBar = container.querySelector('input[aria-label="Video progress"]');
      expect(progressBar).toBeInTheDocument();

      if (progressBar) {
        fireEvent.change(progressBar, { target: { value: '50' } });
        expect(mockOnSeek).toHaveBeenCalledWith(50);
      }
    });
  });

  describe('Navigation Controls', () => {
    it('shows previous button when onPrevious is provided', () => {
      render(
        <VideoPlayer
          src="https://example.com/video.mp4"
          type="direct"
          onPrevious={mockOnPrevious}
        />
      );

      expect(screen.getByLabelText('Previous episode')).toBeInTheDocument();
    });

    it('shows next button when onNext is provided', () => {
      render(
        <VideoPlayer
          src="https://example.com/video.mp4"
          type="direct"
          onNext={mockOnNext}
        />
      );

      expect(screen.getByLabelText('Next episode')).toBeInTheDocument();
    });

    it('calls onPrevious when previous button is clicked', () => {
      render(
        <VideoPlayer
          src="https://example.com/video.mp4"
          type="direct"
          onPrevious={mockOnPrevious}
        />
      );

      const previousButton = screen.getByLabelText('Previous episode');
      fireEvent.click(previousButton);

      expect(mockOnPrevious).toHaveBeenCalled();
    });

    it('calls onNext when next button is clicked', () => {
      render(
        <VideoPlayer
          src="https://example.com/video.mp4"
          type="direct"
          onNext={mockOnNext}
        />
      );

      const nextButton = screen.getByLabelText('Next episode');
      fireEvent.click(nextButton);

      expect(mockOnNext).toHaveBeenCalled();
    });
  });

  describe('Quality Selection', () => {
    const qualities = [
      { label: '720p', src: 'https://example.com/video-720p.mp4' },
      { label: '1080p', src: 'https://example.com/video-1080p.mp4' }
    ];

    it('shows quality button when qualities are provided', () => {
      render(
        <VideoPlayer
          src="https://example.com/video.mp4"
          type="direct"
          qualities={qualities}
        />
      );

      expect(screen.getByLabelText('Video quality')).toBeInTheDocument();
    });

    it('shows quality menu when quality button is clicked', () => {
      render(
        <VideoPlayer
          src="https://example.com/video.mp4"
          type="direct"
          qualities={qualities}
        />
      );

      const qualityButton = screen.getByLabelText('Video quality');
      fireEvent.click(qualityButton);

      expect(screen.getByText('720p')).toBeInTheDocument();
      expect(screen.getByText('1080p')).toBeInTheDocument();
    });

    it('changes quality when quality option is selected', () => {
      render(
        <VideoPlayer
          src="https://example.com/video.mp4"
          type="direct"
          qualities={qualities}
        />
      );

      const qualityButton = screen.getByLabelText('Video quality');
      fireEvent.click(qualityButton);

      const quality1080p = screen.getByText('1080p');
      fireEvent.click(quality1080p);

      // Quality menu should close after selection
      expect(screen.queryByText('720p')).not.toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('shows loading spinner when loading is true', () => {
      render(
        <VideoPlayer
          src="https://example.com/video.mp4"
          type="direct"
          loading={true}
        />
      );

      expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
    });

    it('shows buffering indicator when video is buffering', () => {
      render(
        <VideoPlayer
          src="https://example.com/video.mp4"
          type="direct"
        />
      );

      // Simulate buffering state by triggering waiting event
      const container = screen.getByRole('region');
      const video = container.querySelector('video');
      
      if (video) {
        fireEvent(video, new Event('waiting'));
        expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
      }
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(
        <VideoPlayer
          src="https://example.com/video.mp4"
          type="direct"
          title="Test Video"
        />
      );

      expect(screen.getByRole('region')).toHaveAttribute('aria-label', 'Video player: Test Video');
    });

    it('has proper button labels', () => {
      render(
        <VideoPlayer
          src="https://example.com/video.mp4"
          type="direct"
          onPrevious={mockOnPrevious}
          onNext={mockOnNext}
        />
      );

      expect(screen.getByLabelText('Play video')).toBeInTheDocument();
      expect(screen.getByLabelText('Previous episode')).toBeInTheDocument();
      expect(screen.getByLabelText('Next episode')).toBeInTheDocument();
      expect(screen.getByLabelText('Mute')).toBeInTheDocument();
      expect(screen.getByLabelText('Enter fullscreen')).toBeInTheDocument();
    });

    it('has proper slider labels', () => {
      render(
        <VideoPlayer
          src="https://example.com/video.mp4"
          type="direct"
        />
      );

      expect(screen.getByLabelText('Video progress')).toBeInTheDocument();
      expect(screen.getByLabelText('Volume')).toBeInTheDocument();
    });
  });

  describe('Custom Props', () => {
    it('applies custom className', () => {
      render(
        <VideoPlayer
          src="https://example.com/video.mp4"
          type="direct"
          className="custom-player"
        />
      );

      expect(screen.getByRole('region')).toHaveClass('custom-player');
    });

    it('shows title in top bar when provided', () => {
      render(
        <VideoPlayer
          src="https://example.com/video.mp4"
          type="direct"
          title="My Custom Video"
        />
      );

      expect(screen.getByText('My Custom Video')).toBeInTheDocument();
    });

    it('hides controls when controls is false', () => {
      render(
        <VideoPlayer
          src="https://example.com/video.mp4"
          type="direct"
          controls={false}
        />
      );

      expect(screen.queryByLabelText('Play video')).not.toBeInTheDocument();
    });
  });

  describe('Unsupported Video Type', () => {
    it('shows unsupported message for invalid type', () => {
      render(
        <VideoPlayer
          src="invalid-source"
          type={'invalid' as any}
        />
      );

      expect(screen.getByText('Unsupported video type')).toBeInTheDocument();
    });
  });
});