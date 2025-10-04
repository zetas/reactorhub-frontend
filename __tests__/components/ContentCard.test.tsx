import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ContentCard from '@/components/ContentCard';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

describe('ContentCard', () => {
  const defaultProps = {
    id: 'test-content-1',
    title: 'Test Content',
    thumbnail: 'https://example.com/thumbnail.jpg',
    progress: 0,
    duration: '45 min',
    type: 'episode' as const,
    seriesName: 'Test Series',
    episodeNumber: '1',
    creatorName: 'Test Creator',
    isPaid: false,
    tierRequired: 1,
  };

  it('renders content card with basic information', () => {
    render(<ContentCard {...defaultProps} />);
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByText('Test Series')).toBeInTheDocument();
    expect(screen.getByText('Episode 1')).toBeInTheDocument();
    expect(screen.getByText('by Test Creator')).toBeInTheDocument();
    expect(screen.getByText('45 min')).toBeInTheDocument();
  });

  it('displays thumbnail image when provided', () => {
    render(<ContentCard {...defaultProps} />);
    
    const thumbnail = screen.getByAltText('Test Content');
    expect(thumbnail).toBeInTheDocument();
    expect(thumbnail).toHaveAttribute('src', 'https://example.com/thumbnail.jpg');
  });

  it('shows placeholder when no thumbnail provided', () => {
    render(<ContentCard {...defaultProps} thumbnail={undefined} />);
    
    const playIcon = screen.getAllByTestId('mock-icon')[0];
    expect(playIcon).toBeInTheDocument();
  });

  it('displays progress bar when progress > 0', () => {
    render(<ContentCard {...defaultProps} progress={50} />);
    
    const progressBar = screen.getByLabelText('watch progress');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '50');
    expect(progressBar).toHaveStyle({ width: '50%' });
  });

  it('does not show progress bar when progress is 0', () => {
    render(<ContentCard {...defaultProps} progress={0} />);
    
    expect(screen.queryByLabelText('watch progress')).not.toBeInTheDocument();
  });

  it('shows paid badge for paid content', () => {
    render(<ContentCard {...defaultProps} isPaid={true} tierRequired={5} />);
    
    expect(screen.getByText('Tier 5+')).toBeInTheDocument();
  });

  it('does not show paid badge for free content', () => {
    render(<ContentCard {...defaultProps} isPaid={false} />);
    
    expect(screen.queryByText(/Tier/)).not.toBeInTheDocument();
  });

  it('has proper hover event handlers', () => {
    render(<ContentCard {...defaultProps} />);
    
    const card = screen.getByRole('link');
    expect(card).toHaveAttribute('href', '/watch/test-content-1');
    
    // Test that mouse events don't throw errors
    fireEvent.mouseEnter(card);
    fireEvent.mouseLeave(card);
  });

  it('renders with proper structure for hover overlay', () => {
    render(<ContentCard {...defaultProps} />);
    
    // Check that the component has the structure needed for hover overlay
    const cardContainer = screen.getByRole('link').firstChild;
    expect(cardContainer).toHaveClass('relative', 'group', 'cursor-pointer');
  });

  it('links to correct watch URL', () => {
    render(<ContentCard {...defaultProps} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/watch/test-content-1');
  });

  it('handles missing optional props gracefully', () => {
    const minimalProps = {
      id: 'test-content-1',
      title: 'Test Content',
    };
    
    render(<ContentCard {...minimalProps} />);
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.queryByText('Test Series')).not.toBeInTheDocument();
    expect(screen.queryByText(/Episode/)).not.toBeInTheDocument();
  });

  it('clamps progress values to valid range', () => {
    render(<ContentCard {...defaultProps} progress={150} />);
    
    const progressBar = screen.getByLabelText('watch progress');
    expect(progressBar).toHaveAttribute('aria-valuenow', '100');
  });

  it('handles negative progress values', () => {
    render(<ContentCard {...defaultProps} progress={-10} />);
    
    // Negative progress should not render a progress bar
    expect(screen.queryByLabelText('watch progress')).not.toBeInTheDocument();
  });
});