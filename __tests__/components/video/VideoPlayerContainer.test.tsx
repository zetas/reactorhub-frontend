import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import VideoPlayerContainer from '@/components/video/VideoPlayerContainer';
import { useVideoProgress } from '@/lib/hooks/useVideoProgress';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

// Mock the video progress hook
jest.mock('@/lib/hooks/useVideoProgress', () => ({
  useVideoProgress: jest.fn()
}));

// Mock the VideoPlayer component
jest.mock('@/components/video/VideoPlayer', () => {
  return function MockVideoPlayer({ onTimeUpdate, onEnded, onPrevious, onNext, qualities, ...props }: any) {
    return (
      <div 
        data-testid="video-player" 
        data-src={props.src}
        data-type={props.type}
        data-title={props.title}
        data-start-time={props.startTime}
        data-autoplay={props.autoplay}
        data-qualities={qualities ? JSON.stringify(qualities) : undefined}
      >
        <button onClick={() => onTimeUpdate?.(30, 100)} data-testid="simulate-time-update">
          Simulate Time Update
        </button>
        <button onClick={() => onEnded?.()} data-testid="simulate-video-end">
          Simulate Video End
        </button>
        <button onClick={() => onPrevious?.()} data-testid="simulate-previous">
          Previous
        </button>
        <button onClick={() => onNext?.()} data-testid="simulate-next">
          Next
        </button>
      </div>
    );
  };
});

// Mock LoadingSpinner
jest.mock('@/components/netflix/LoadingSpinner', () => {
  return function MockLoadingSpinner({ label, size }: any) {
    return <div data-testid="loading-spinner">{label}</div>;
  };
});

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  ArrowLeft: ({ className, ...props }: any) => <div className={className} data-testid="arrow-left-icon" {...props} />,
  AlertCircle: ({ className, ...props }: any) => <div className={className} data-testid="alert-circle-icon" {...props} />
}));

const mockRouter = {
  push: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  replace: jest.fn()
};

const mockUseVideoProgress = useVideoProgress as jest.MockedFunction<typeof useVideoProgress>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('VideoPlayerContainer', () => {
  const mockContent = {
    id: 'test-content-id',
    title: 'Test Video',
    description: 'This is a test video description',
    video_url: 'https://example.com/video.mp4',
    duration_seconds: 300,
    series_name: 'Test Series',
    episode_number: '1',
    next_episode_id: 'next-episode-id',
    previous_episode_id: 'prev-episode-id',
    creator_name: 'Test Creator',
    watched_seconds: 30,
    is_completed: false
  };

  const mockProgress = {
    contentId: 'test-content-id',
    watchedSeconds: 30,
    totalSeconds: 300,
    progressPercentage: 10,
    isCompleted: false,
    lastWatchedAt: new Date()
  };

  const mockVideoProgressReturn = {
    progress: mockProgress,
    isLoading: false,
    isSaving: false,
    error: null,
    updateProgress: jest.fn(),
    markCompleted: jest.fn(),
    resetProgress: jest.fn(),
    saveProgress: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue(mockRouter);
    mockUseVideoProgress.mockReturnValue(mockVideoProgressReturn);
  });

  describe('Rendering', () => {
    it('renders video player with content', () => {
      render(<VideoPlayerContainer content={mockContent} />);

      expect(screen.getByTestId('video-player')).toBeInTheDocument();
      expect(screen.getByText('Test Video')).toBeInTheDocument();
      expect(screen.getByText('Test Series • Episode 1')).toBeInTheDocument();
      expect(screen.getByText('by Test Creator')).toBeInTheDocument();
    });

    it('renders back button by default', () => {
      render(<VideoPlayerContainer content={mockContent} />);

      expect(screen.getByLabelText('Go back')).toBeInTheDocument();
    });

    it('hides back button when showBackButton is false', () => {
      render(<VideoPlayerContainer content={mockContent} showBackButton={false} />);

      expect(screen.queryByLabelText('Go back')).not.toBeInTheDocument();
    });

    it('shows video description when available', () => {
      render(<VideoPlayerContainer content={mockContent} />);

      expect(screen.getByText('About this video')).toBeInTheDocument();
      expect(screen.getByText('This is a test video description')).toBeInTheDocument();
    });

    it('shows progress bar when progress is available', () => {
      render(<VideoPlayerContainer content={mockContent} />);

      const progressBar = document.querySelector('.bg-red-600');
      expect(progressBar).toBeInTheDocument();
      expect(progressBar).toHaveStyle('width: 10%');
    });

    it('shows episode navigation buttons when available', () => {
      render(<VideoPlayerContainer content={mockContent} />);

      expect(screen.getByText('← Previous Episode')).toBeInTheDocument();
      expect(screen.getByText('Next Episode →')).toBeInTheDocument();
    });
  });

  describe('Video Source Detection', () => {
    it('detects YouTube video source', () => {
      const youtubeContent = {
        ...mockContent,
        youtube_id: 'dQw4w9WgXcQ',
        video_url: undefined
      };

      render(<VideoPlayerContainer content={youtubeContent} />);

      const videoPlayer = screen.getByTestId('video-player');
      expect(videoPlayer).toHaveAttribute('data-src', 'dQw4w9WgXcQ');
      expect(videoPlayer).toHaveAttribute('data-type', 'youtube');
    });

    it('detects Vimeo video source', () => {
      const vimeoContent = {
        ...mockContent,
        vimeo_id: '123456789',
        video_url: undefined,
        youtube_id: undefined
      };

      render(<VideoPlayerContainer content={vimeoContent} />);

      const videoPlayer = screen.getByTestId('video-player');
      expect(videoPlayer).toHaveAttribute('data-src', '123456789');
      expect(videoPlayer).toHaveAttribute('data-type', 'vimeo');
    });

    it('detects direct video source', () => {
      render(<VideoPlayerContainer content={mockContent} />);

      const videoPlayer = screen.getByTestId('video-player');
      expect(videoPlayer).toHaveAttribute('data-src', 'https://example.com/video.mp4');
      expect(videoPlayer).toHaveAttribute('data-type', 'direct');
    });

    it('shows no video available when no source is found', () => {
      const noVideoContent = {
        ...mockContent,
        video_url: undefined,
        youtube_id: undefined,
        vimeo_id: undefined
      };

      render(<VideoPlayerContainer content={noVideoContent} />);

      expect(screen.getByText('No Video Available')).toBeInTheDocument();
      expect(screen.getByText("This content doesn't have a video source.")).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('shows loading spinner when loading is true', () => {
      render(<VideoPlayerContainer content={mockContent} loading={true} />);

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      expect(screen.getByText('Loading video...')).toBeInTheDocument();
    });

    it('shows loading spinner when progress is loading', () => {
      mockUseVideoProgress.mockReturnValue({
        ...mockVideoProgressReturn,
        isLoading: true
      });

      render(<VideoPlayerContainer content={mockContent} />);

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('shows saving indicator when progress is saving', () => {
      mockUseVideoProgress.mockReturnValue({
        ...mockVideoProgressReturn,
        isSaving: true
      });

      render(<VideoPlayerContainer content={mockContent} />);

      expect(screen.getByText('Saving...')).toBeInTheDocument();
    });
  });

  describe('Error States', () => {
    it('shows error message when error prop is provided', () => {
      render(<VideoPlayerContainer content={mockContent} error="Failed to load video" />);

      expect(screen.getByText('Error Loading Video')).toBeInTheDocument();
      expect(screen.getByText('Failed to load video')).toBeInTheDocument();
    });

    it('shows error message when progress has error', () => {
      mockUseVideoProgress.mockReturnValue({
        ...mockVideoProgressReturn,
        error: 'Progress loading failed'
      });

      render(<VideoPlayerContainer content={mockContent} />);

      expect(screen.getByText('Error Loading Video')).toBeInTheDocument();
      expect(screen.getByText('Progress loading failed')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('calls router.back when back button is clicked', () => {
      render(<VideoPlayerContainer content={mockContent} />);

      const backButton = screen.getByLabelText('Go back');
      fireEvent.click(backButton);

      expect(mockRouter.back).toHaveBeenCalled();
    });

    it('calls custom onBack when provided', () => {
      const mockOnBack = jest.fn();
      render(<VideoPlayerContainer content={mockContent} onBack={mockOnBack} />);

      const backButton = screen.getByLabelText('Go back');
      fireEvent.click(backButton);

      expect(mockOnBack).toHaveBeenCalled();
      expect(mockRouter.back).not.toHaveBeenCalled();
    });

    it('navigates to previous episode', () => {
      render(<VideoPlayerContainer content={mockContent} />);

      const previousButton = screen.getByText('← Previous Episode');
      fireEvent.click(previousButton);

      expect(mockVideoProgressReturn.saveProgress).toHaveBeenCalled();
      expect(mockRouter.push).toHaveBeenCalledWith('/watch/prev-episode-id');
    });

    it('navigates to next episode', () => {
      render(<VideoPlayerContainer content={mockContent} />);

      const nextButton = screen.getByText('Next Episode →');
      fireEvent.click(nextButton);

      expect(mockVideoProgressReturn.saveProgress).toHaveBeenCalled();
      expect(mockRouter.push).toHaveBeenCalledWith('/watch/next-episode-id');
    });

    it('simulates previous episode navigation from video player', () => {
      render(<VideoPlayerContainer content={mockContent} />);

      const simulatePrevious = screen.getByTestId('simulate-previous');
      fireEvent.click(simulatePrevious);

      expect(mockVideoProgressReturn.saveProgress).toHaveBeenCalled();
      expect(mockRouter.push).toHaveBeenCalledWith('/watch/prev-episode-id');
    });

    it('simulates next episode navigation from video player', () => {
      render(<VideoPlayerContainer content={mockContent} />);

      const simulateNext = screen.getByTestId('simulate-next');
      fireEvent.click(simulateNext);

      expect(mockVideoProgressReturn.saveProgress).toHaveBeenCalled();
      expect(mockRouter.push).toHaveBeenCalledWith('/watch/next-episode-id');
    });
  });

  describe('Progress Tracking', () => {
    it('updates progress when video time updates', () => {
      render(<VideoPlayerContainer content={mockContent} />);

      const simulateTimeUpdate = screen.getByTestId('simulate-time-update');
      fireEvent.click(simulateTimeUpdate);

      expect(mockVideoProgressReturn.updateProgress).toHaveBeenCalledWith(30, 100);
    });

    it('marks as completed when video ends', () => {
      render(<VideoPlayerContainer content={mockContent} />);

      const simulateVideoEnd = screen.getByTestId('simulate-video-end');
      fireEvent.click(simulateVideoEnd);

      expect(mockVideoProgressReturn.markCompleted).toHaveBeenCalled();
    });

    it('auto-navigates to next episode after video ends', async () => {
      jest.useFakeTimers();

      render(<VideoPlayerContainer content={mockContent} />);

      const simulateVideoEnd = screen.getByTestId('simulate-video-end');
      fireEvent.click(simulateVideoEnd);

      // Fast-forward the 3-second delay
      jest.advanceTimersByTime(3000);

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/watch/next-episode-id');
      });

      jest.useRealTimers();
    });

    it('does not auto-navigate when no next episode', async () => {
      jest.useFakeTimers();

      const contentWithoutNext = {
        ...mockContent,
        next_episode_id: undefined
      };

      render(<VideoPlayerContainer content={contentWithoutNext} />);

      const simulateVideoEnd = screen.getByTestId('simulate-video-end');
      fireEvent.click(simulateVideoEnd);

      jest.advanceTimersByTime(3000);

      expect(mockRouter.push).not.toHaveBeenCalled();

      jest.useRealTimers();
    });
  });

  describe('Video Player Props', () => {
    it('passes correct props to VideoPlayer', () => {
      render(<VideoPlayerContainer content={mockContent} autoplay={true} />);

      const videoPlayer = screen.getByTestId('video-player');
      expect(videoPlayer).toHaveAttribute('data-title', 'Test Video');
      expect(videoPlayer).toHaveAttribute('data-start-time', '30');
      expect(videoPlayer).toHaveAttribute('data-autoplay', 'true');
    });

    it('passes qualities to VideoPlayer when available', () => {
      const contentWithQualities = {
        ...mockContent,
        qualities: [
          { label: '720p', src: 'https://example.com/video-720p.mp4' },
          { label: '1080p', src: 'https://example.com/video-1080p.mp4' }
        ]
      };

      render(<VideoPlayerContainer content={contentWithQualities} />);

      const videoPlayer = screen.getByTestId('video-player');
      expect(videoPlayer).toHaveAttribute('data-qualities', JSON.stringify(contentWithQualities.qualities));
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels for buttons', () => {
      render(<VideoPlayerContainer content={mockContent} />);

      expect(screen.getByLabelText('Go back')).toBeInTheDocument();
    });

    it('shows proper heading structure', () => {
      render(<VideoPlayerContainer content={mockContent} />);

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Test Video');
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('About this video');
    });
  });

  describe('Custom Props', () => {
    it('applies custom className', () => {
      const { container } = render(
        <VideoPlayerContainer content={mockContent} className="custom-container" />
      );

      expect(container.firstChild).toHaveClass('custom-container');
    });

    it('handles content without optional fields', () => {
      const minimalContent = {
        id: 'test-id',
        title: 'Minimal Video',
        video_url: 'https://example.com/minimal.mp4' // Need a video source to render the player
      };

      render(<VideoPlayerContainer content={minimalContent} />);

      expect(screen.getByText('Minimal Video')).toBeInTheDocument();
      expect(screen.queryByText('About this video')).not.toBeInTheDocument();
      expect(screen.queryByText('← Previous Episode')).not.toBeInTheDocument();
      expect(screen.queryByText('Next Episode →')).not.toBeInTheDocument();
    });
  });

  describe('Cleanup', () => {
    it('saves progress on unmount', () => {
      const { unmount } = render(<VideoPlayerContainer content={mockContent} />);

      unmount();

      expect(mockVideoProgressReturn.saveProgress).toHaveBeenCalled();
    });

    it('adds beforeunload event listener', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

      render(<VideoPlayerContainer content={mockContent} />);

      expect(addEventListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function));
    });

    it('removes beforeunload event listener on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

      const { unmount } = render(<VideoPlayerContainer content={mockContent} />);

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function));
    });
  });
});