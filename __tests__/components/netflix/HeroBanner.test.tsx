import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HeroBanner from '@/components/netflix/HeroBanner';
import { ContentSummary } from '@/lib/services/browse';

describe('HeroBanner', () => {
  const mockContent: ContentSummary = {
    id: 'test-content-1',
    title: 'Breaking Bad S01E01',
    seriesName: 'Breaking Bad',
    episodeLabel: 'S01E01 - Pilot',
    creatorName: 'Test Creator',
    thumbnail: 'https://example.com/thumbnail.jpg',
    durationLabel: '47 min',
    isPaid: true,
    tierRequired: 5,
    progress: 0,
  };

  const mockOnPlay = jest.fn();
  const mockOnMoreInfo = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders hero banner with content information', () => {
    render(
      <HeroBanner 
        content={mockContent} 
        onPlay={mockOnPlay} 
        onMoreInfo={mockOnMoreInfo} 
      />
    );

    expect(screen.getByText('Breaking Bad S01E01')).toBeInTheDocument();
    expect(screen.getByText('Breaking Bad')).toBeInTheDocument();
    expect(screen.getByText('S01E01 - Pilot')).toBeInTheDocument();
    expect(screen.getByText('by Test Creator')).toBeInTheDocument();
    expect(screen.getByText('47 min')).toBeInTheDocument();
    expect(screen.getByText('Featured')).toBeInTheDocument();
  });

  it('displays background image when thumbnail is provided', () => {
    render(
      <HeroBanner 
        content={mockContent} 
        onPlay={mockOnPlay} 
        onMoreInfo={mockOnMoreInfo} 
      />
    );

    const section = screen.getByRole('region');
    const backgroundDiv = section.querySelector('[style*="background-image"]');
    expect(backgroundDiv).toHaveStyle({
      backgroundImage: 'url(https://example.com/thumbnail.jpg)'
    });
  });

  it('handles missing thumbnail gracefully', () => {
    const contentWithoutThumbnail = { ...mockContent, thumbnail: undefined };
    
    render(
      <HeroBanner 
        content={contentWithoutThumbnail} 
        onPlay={mockOnPlay} 
        onMoreInfo={mockOnMoreInfo} 
      />
    );

    const section = screen.getByRole('region');
    const backgroundDiv = section.querySelector('[style*="background-image"]');
    expect(backgroundDiv).toBeNull();
  });

  it('calls onPlay when play button is clicked', () => {
    render(
      <HeroBanner 
        content={mockContent} 
        onPlay={mockOnPlay} 
        onMoreInfo={mockOnMoreInfo} 
      />
    );

    const playButton = screen.getByRole('button', { name: /play/i });
    fireEvent.click(playButton);

    expect(mockOnPlay).toHaveBeenCalledTimes(1);
  });

  it('calls onMoreInfo when more info button is clicked', () => {
    render(
      <HeroBanner 
        content={mockContent} 
        onPlay={mockOnPlay} 
        onMoreInfo={mockOnMoreInfo} 
      />
    );

    const moreInfoButton = screen.getByRole('button', { name: /more info/i });
    fireEvent.click(moreInfoButton);

    expect(mockOnMoreInfo).toHaveBeenCalledTimes(1);
  });

  it('handles missing optional content fields', () => {
    const minimalContent: ContentSummary = {
      id: 'test-content-1',
      title: 'Simple Title',
      isPaid: false,
      progress: 0,
    };

    render(
      <HeroBanner 
        content={minimalContent} 
        onPlay={mockOnPlay} 
        onMoreInfo={mockOnMoreInfo} 
      />
    );

    expect(screen.getByText('Simple Title')).toBeInTheDocument();
    expect(screen.queryByText(/by/)).not.toBeInTheDocument();
    expect(screen.queryByText(/S\d+E\d+/)).not.toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(
      <HeroBanner 
        content={mockContent} 
        onPlay={mockOnPlay} 
        onMoreInfo={mockOnMoreInfo} 
      />
    );

    const section = screen.getByRole('region');
    expect(section).toHaveAttribute('aria-labelledby', 'hero-heading');

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveAttribute('id', 'hero-heading');

    const backgroundDiv = section.querySelector('[aria-hidden]');
    expect(backgroundDiv).toHaveAttribute('aria-hidden');
  });

  it('displays play and more info buttons with correct styling', () => {
    render(
      <HeroBanner 
        content={mockContent} 
        onPlay={mockOnPlay} 
        onMoreInfo={mockOnMoreInfo} 
      />
    );

    const playButton = screen.getByRole('button', { name: /play/i });
    const moreInfoButton = screen.getByRole('button', { name: /more info/i });

    expect(playButton).toHaveClass('bg-white', 'text-black');
    expect(moreInfoButton).toHaveClass('border-gray-500', 'text-white');
  });

  it('shows duration label when provided', () => {
    render(
      <HeroBanner 
        content={mockContent} 
        onPlay={mockOnPlay} 
        onMoreInfo={mockOnMoreInfo} 
      />
    );

    expect(screen.getByText('47 min')).toBeInTheDocument();
  });

  it('does not show duration when not provided', () => {
    const contentWithoutDuration = { ...mockContent, durationLabel: undefined };
    
    render(
      <HeroBanner 
        content={contentWithoutDuration} 
        onPlay={mockOnPlay} 
        onMoreInfo={mockOnMoreInfo} 
      />
    );

    expect(screen.queryByText(/min/)).not.toBeInTheDocument();
  });

  describe('Auto-play Preview', () => {
    it('starts auto-play preview after hover delay', async () => {
      const mockOnPreviewStart = jest.fn();
      render(
        <HeroBanner 
          content={mockContent} 
          onPlay={mockOnPlay} 
          onMoreInfo={mockOnMoreInfo}
          onPreviewStart={mockOnPreviewStart}
        />
      );

      const banner = screen.getByRole('region');
      fireEvent.mouseEnter(banner);

      // Wait for auto-play delay (2 seconds)
      await new Promise(resolve => setTimeout(resolve, 2100));
      
      expect(mockOnPreviewStart).toHaveBeenCalledWith(mockContent);
    });

    it('stops auto-play preview on mouse leave', () => {
      const mockOnPreviewStop = jest.fn();
      render(
        <HeroBanner 
          content={mockContent} 
          onPlay={mockOnPlay} 
          onMoreInfo={mockOnMoreInfo}
          onPreviewStop={mockOnPreviewStop}
        />
      );

      const banner = screen.getByRole('region');
      fireEvent.mouseEnter(banner);
      fireEvent.mouseLeave(banner);

      expect(mockOnPreviewStop).toHaveBeenCalled();
    });

    it('shows mute/unmute button during preview', () => {
      render(
        <HeroBanner 
          content={mockContent} 
          onPlay={mockOnPlay} 
          onMoreInfo={mockOnMoreInfo}
          isPreviewPlaying={true}
        />
      );

      expect(screen.getByRole('button', { name: /mute/i })).toBeInTheDocument();
    });

    it('toggles mute state when mute button is clicked', () => {
      const mockOnMuteToggle = jest.fn();
      render(
        <HeroBanner 
          content={mockContent} 
          onPlay={mockOnPlay} 
          onMoreInfo={mockOnMoreInfo}
          isPreviewPlaying={true}
          isMuted={false}
          onMuteToggle={mockOnMuteToggle}
        />
      );

      const muteButton = screen.getByRole('button', { name: /mute/i });
      fireEvent.click(muteButton);

      expect(mockOnMuteToggle).toHaveBeenCalled();
    });
  });

  describe('Watch Progress', () => {
    it('displays progress bar when watch progress exists', () => {
      const contentWithProgress = { ...mockContent, progress: 0.4 }; // 40% watched
      render(
        <HeroBanner 
          content={contentWithProgress} 
          onPlay={mockOnPlay} 
          onMoreInfo={mockOnMoreInfo} 
        />
      );

      const progressBar = screen.getByTestId('progress-bar');
      expect(progressBar).toBeInTheDocument();
      expect(progressBar).toHaveStyle('width: 40%');
    });

    it('shows continue watching text when progress exists', () => {
      const contentWithProgress = { ...mockContent, progress: 0.6 };
      render(
        <HeroBanner 
          content={contentWithProgress} 
          onPlay={mockOnPlay} 
          onMoreInfo={mockOnMoreInfo} 
        />
      );

      expect(screen.getByText(/continue watching/i)).toBeInTheDocument();
    });

    it('shows watch now text when no progress', () => {
      render(
        <HeroBanner 
          content={mockContent} 
          onPlay={mockOnPlay} 
          onMoreInfo={mockOnMoreInfo} 
        />
      );

      expect(screen.getByText(/play/i)).toBeInTheDocument();
      expect(screen.queryByText(/continue watching/i)).not.toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('applies mobile-specific classes on small screens', () => {
      // Mock window.matchMedia for mobile
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(max-width: 768px)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      render(
        <HeroBanner 
          content={mockContent} 
          onPlay={mockOnPlay} 
          onMoreInfo={mockOnMoreInfo} 
        />
      );

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveClass('text-5xl');
    });
  });

  describe('Performance Optimizations', () => {
    it('lazy loads background image', () => {
      render(
        <HeroBanner 
          content={mockContent} 
          onPlay={mockOnPlay} 
          onMoreInfo={mockOnMoreInfo} 
        />
      );

      // Background should be applied via CSS, not img tag for performance
      const section = screen.getByRole('region');
      const backgroundDiv = section.querySelector('[style*="background-image"]');
      expect(backgroundDiv).toBeInTheDocument();
    });

    it('preloads video on hover for smooth preview', () => {
      const mockOnPreload = jest.fn();
      render(
        <HeroBanner 
          content={mockContent} 
          onPlay={mockOnPlay} 
          onMoreInfo={mockOnMoreInfo}
          onPreload={mockOnPreload}
        />
      );

      const banner = screen.getByRole('region');
      fireEvent.mouseEnter(banner);

      expect(mockOnPreload).toHaveBeenCalledWith(mockContent);
    });
  });
});