import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSpinner, { LoadingOverlay, LoadingContent } from '@/components/netflix/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />);

    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('aria-label', 'Loading...');
  });

  it('renders with custom label', () => {
    render(<LoadingSpinner label="Processing..." />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveAttribute('aria-label', 'Processing...');
    expect(screen.getByText('Processing...')).toBeInTheDocument();
  });

  it('applies correct size classes', () => {
    const { rerender } = render(<LoadingSpinner size="sm" />);
    let svg = screen.getByRole('status').querySelector('svg');
    expect(svg).toHaveClass('h-4', 'w-4');

    rerender(<LoadingSpinner size="md" />);
    svg = screen.getByRole('status').querySelector('svg');
    expect(svg).toHaveClass('h-6', 'w-6');

    rerender(<LoadingSpinner size="lg" />);
    svg = screen.getByRole('status').querySelector('svg');
    expect(svg).toHaveClass('h-8', 'w-8');

    rerender(<LoadingSpinner size="xl" />);
    svg = screen.getByRole('status').querySelector('svg');
    expect(svg).toHaveClass('h-12', 'w-12');
  });

  it('applies correct color classes', () => {
    const { rerender } = render(<LoadingSpinner color="white" />);
    let svg = screen.getByRole('status').querySelector('svg');
    expect(svg).toHaveClass('text-white');

    rerender(<LoadingSpinner color="red" />);
    svg = screen.getByRole('status').querySelector('svg');
    expect(svg).toHaveClass('text-red-500');

    rerender(<LoadingSpinner color="gray" />);
    svg = screen.getByRole('status').querySelector('svg');
    expect(svg).toHaveClass('text-gray-400');
  });

  it('applies custom className', () => {
    render(<LoadingSpinner className="custom-class" />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('custom-class');
  });

  it('has proper accessibility attributes', () => {
    render(<LoadingSpinner />);

    const spinner = screen.getByRole('status');
    const svg = spinner.querySelector('svg');
    const srText = spinner.querySelector('.sr-only');

    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(srText).toHaveTextContent('Loading...');
  });
});

describe('LoadingOverlay', () => {
  it('renders with default props', () => {
    const { container } = render(<LoadingOverlay />);

    const overlay = container.querySelector('.fixed.inset-0.z-50');
    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveAttribute('aria-label', 'Loading...');
    expect(overlay).toHaveClass('bg-black/80');
    
    const messageText = container.querySelector('p.text-white.text-lg.font-medium');
    expect(messageText).toHaveTextContent('Loading...');
  });

  it('renders with custom message', () => {
    const { container } = render(<LoadingOverlay message="Saving changes..." />);

    const overlay = container.querySelector('.fixed.inset-0.z-50');
    expect(overlay).toHaveAttribute('aria-label', 'Saving changes...');
    expect(screen.getByText('Saving changes...')).toBeInTheDocument();
  });

  it('applies transparent background when specified', () => {
    const { container } = render(<LoadingOverlay transparent={true} />);

    const overlay = container.querySelector('.fixed.inset-0.z-50');
    expect(overlay).toHaveClass('bg-black/50');
  });

  it('applies opaque background by default', () => {
    const { container } = render(<LoadingOverlay />);

    const overlay = container.querySelector('.fixed.inset-0.z-50');
    expect(overlay).toHaveClass('bg-black/80');
  });

  it('has proper z-index and positioning', () => {
    const { container } = render(<LoadingOverlay />);

    const overlay = container.querySelector('.fixed.inset-0.z-50');
    expect(overlay).toHaveClass('fixed', 'inset-0', 'z-50');
  });

  it('contains loading spinner', () => {
    const { container } = render(<LoadingOverlay />);

    // The LoadingSpinner component should be present
    const spinner = container.querySelector('svg.animate-spin');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('animate-spin');
  });
});

describe('LoadingContent', () => {
  it('renders with default number of lines', () => {
    const { container } = render(<LoadingContent />);

    const loadingContainer = container.querySelector('[aria-hidden="true"]');
    const lines = loadingContainer?.querySelectorAll('.h-4.bg-gray-700.rounded');
    
    expect(loadingContainer).toHaveClass('animate-pulse');
    expect(lines).toHaveLength(3);
  });

  it('renders with custom number of lines', () => {
    const { container } = render(<LoadingContent lines={5} />);

    const loadingContainer = container.querySelector('[aria-hidden="true"]');
    const lines = loadingContainer?.querySelectorAll('.h-4.bg-gray-700.rounded');
    
    expect(lines).toHaveLength(5);
  });

  it('applies custom className', () => {
    const { container } = render(<LoadingContent className="custom-loading" />);

    const loadingContainer = container.querySelector('[aria-hidden="true"]');
    expect(loadingContainer).toHaveClass('custom-loading');
  });

  it('makes last line shorter', () => {
    const { container } = render(<LoadingContent lines={3} />);

    const loadingContainer = container.querySelector('[aria-hidden="true"]');
    const lines = loadingContainer?.querySelectorAll('.h-4.bg-gray-700.rounded');
    
    // First two lines should be full width
    expect(lines?.[0]).toHaveClass('w-full');
    expect(lines?.[1]).toHaveClass('w-full');
    
    // Last line should be 3/4 width
    expect(lines?.[2]).toHaveClass('w-3/4');
  });

  it('has proper accessibility attributes', () => {
    const { container } = render(<LoadingContent />);

    const loadingContainer = container.querySelector('[aria-hidden="true"]');
    expect(loadingContainer).toHaveAttribute('aria-hidden', 'true');
  });

  it('handles single line correctly', () => {
    const { container } = render(<LoadingContent lines={1} />);

    const loadingContainer = container.querySelector('[aria-hidden="true"]');
    const lines = loadingContainer?.querySelectorAll('.h-4.bg-gray-700.rounded');
    
    expect(lines).toHaveLength(1);
    expect(lines?.[0]).toHaveClass('w-3/4'); // Single line should be shorter
  });
});