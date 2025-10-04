import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ContentGrid from '@/components/netflix/ContentGrid';
import { ContentSummary } from '@/lib/services/browse';

// Mock ContentCard component
jest.mock('@/components/ContentCard', () => {
  return function MockContentCard({ title, id }: { title: string; id: string }) {
    return <div data-testid={`content-card-${id}`}>{title}</div>;
  };
});

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

describe('ContentGrid', () => {
  const mockItems: ContentSummary[] = [
    {
      id: 'content-1',
      title: 'Breaking Bad S01E01',
      seriesName: 'Breaking Bad',
      episodeLabel: 'S01E01',
      creatorName: 'Test Creator',
      thumbnail: 'https://example.com/thumb1.jpg',
      durationLabel: '47 min',
      isPaid: true,
      tierRequired: 5,
      progress: 25,
    },
    {
      id: 'content-2',
      title: 'Breaking Bad S01E02',
      seriesName: 'Breaking Bad',
      episodeLabel: 'S01E02',
      creatorName: 'Test Creator',
      thumbnail: 'https://example.com/thumb2.jpg',
      durationLabel: '45 min',
      isPaid: true,
      tierRequired: 5,
      progress: 0,
    },
    {
      id: 'content-3',
      title: 'Breaking Bad S01E03',
      seriesName: 'Breaking Bad',
      episodeLabel: 'S01E03',
      creatorName: 'Test Creator',
      thumbnail: 'https://example.com/thumb3.jpg',
      durationLabel: '48 min',
      isPaid: true,
      tierRequired: 5,
      progress: 100,
    },
  ];

  const mockOnLoadMore = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders content grid with items', () => {
    render(<ContentGrid items={mockItems} />);

    expect(screen.getByTestId('content-card-content-1')).toBeInTheDocument();
    expect(screen.getByTestId('content-card-content-2')).toBeInTheDocument();
    expect(screen.getByTestId('content-card-content-3')).toBeInTheDocument();
  });

  it('renders with title when provided', () => {
    render(<ContentGrid title="Popular Content" items={mockItems} />);

    expect(screen.getByText('Popular Content')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Popular Content');
  });

  it('renders without title when not provided', () => {
    render(<ContentGrid items={mockItems} />);

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('shows loading state with skeleton items', () => {
    render(<ContentGrid items={[]} loading={true} columns={3} />);

    const loadingSection = screen.getByLabelText('Loading content');
    const skeletonItems = loadingSection.querySelectorAll('[aria-hidden="true"]');
    expect(skeletonItems).toHaveLength(9); // 3 columns * 3 rows
    
    skeletonItems.forEach(item => {
      expect(item).toHaveClass('animate-pulse');
    });
  });

  it('shows empty state when no items', () => {
    render(<ContentGrid items={[]} emptyMessage="No videos found" />);

    expect(screen.getByText('No videos found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your filters or check back later.')).toBeInTheDocument();
  });

  it('uses custom empty message', () => {
    const customMessage = 'Custom empty message';
    render(<ContentGrid items={[]} emptyMessage={customMessage} />);

    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('applies correct grid columns classes', () => {
    const { rerender, container } = render(<ContentGrid items={mockItems} columns={2} />);
    
    let gridContainer = container.querySelector('.grid');
    expect(gridContainer).toHaveClass('grid-cols-2');

    rerender(<ContentGrid items={mockItems} columns={3} />);
    gridContainer = container.querySelector('.grid');
    expect(gridContainer).toHaveClass('grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3');

    rerender(<ContentGrid items={mockItems} columns={4} />);
    gridContainer = container.querySelector('.grid');
    expect(gridContainer).toHaveClass('grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3', 'xl:grid-cols-4');

    rerender(<ContentGrid items={mockItems} columns={5} />);
    gridContainer = container.querySelector('.grid');
    expect(gridContainer).toHaveClass('grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3', 'xl:grid-cols-4', '2xl:grid-cols-5');

    rerender(<ContentGrid items={mockItems} columns={6} />);
    gridContainer = container.querySelector('.grid');
    expect(gridContainer).toHaveClass('grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3', 'xl:grid-cols-4', '2xl:grid-cols-6');
  });

  it('shows load more button when enabled', () => {
    render(
      <ContentGrid 
        items={mockItems} 
        showLoadMore={true} 
        onLoadMore={mockOnLoadMore}
        loadMoreLabel="Load More Content"
      />
    );

    const loadMoreButton = screen.getByRole('button', { name: /load more content/i });
    expect(loadMoreButton).toBeInTheDocument();
  });

  it('calls onLoadMore when load more button is clicked', () => {
    render(
      <ContentGrid 
        items={mockItems} 
        showLoadMore={true} 
        onLoadMore={mockOnLoadMore}
      />
    );

    const loadMoreButton = screen.getByRole('button', { name: /load more/i });
    fireEvent.click(loadMoreButton);

    expect(mockOnLoadMore).toHaveBeenCalledTimes(1);
  });

  it('does not show load more button when showLoadMore is false', () => {
    render(
      <ContentGrid 
        items={mockItems} 
        showLoadMore={false} 
        onLoadMore={mockOnLoadMore}
      />
    );

    expect(screen.queryByRole('button', { name: /load more/i })).not.toBeInTheDocument();
  });

  it('does not show load more button when onLoadMore is not provided', () => {
    render(
      <ContentGrid 
        items={mockItems} 
        showLoadMore={true}
      />
    );

    expect(screen.queryByRole('button', { name: /load more/i })).not.toBeInTheDocument();
  });

  it('has proper accessibility attributes with title', () => {
    render(<ContentGrid title="Popular Content" items={mockItems} />);

    const section = screen.getByRole('region');
    expect(section).toHaveAttribute('aria-labelledby', 'grid-popular-content');

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveAttribute('id', 'grid-popular-content');
  });

  it('has proper accessibility attributes without title', () => {
    const { container } = render(<ContentGrid items={mockItems} />);

    const section = container.querySelector('section');
    expect(section).not.toHaveAttribute('aria-labelledby');
  });

  it('generates correct heading id from title', () => {
    render(<ContentGrid title="Recently Added Content" items={mockItems} />);

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveAttribute('id', 'grid-recently-added-content');
  });

  it('renders loading state with title', () => {
    render(<ContentGrid title="Loading Content" items={[]} loading={true} />);

    expect(screen.getByText('Loading Content')).toBeInTheDocument();
    expect(screen.getByLabelText('Loading content')).toBeInTheDocument();
  });

  it('renders empty state with title', () => {
    render(<ContentGrid title="Empty Content" items={[]} />);

    expect(screen.getByText('Empty Content')).toBeInTheDocument();
    expect(screen.getByLabelText('Empty content')).toBeInTheDocument();
  });

  it('uses default load more label when not provided', () => {
    render(
      <ContentGrid 
        items={mockItems} 
        showLoadMore={true} 
        onLoadMore={mockOnLoadMore}
      />
    );

    expect(screen.getByRole('button', { name: /load more/i })).toBeInTheDocument();
  });
});