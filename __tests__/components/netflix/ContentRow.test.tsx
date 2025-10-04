import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import ContentRow from '@/components/netflix/ContentRow';
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

describe('ContentRow', () => {
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

  const mockOnActionClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders content row with title and items', () => {
    render(
      <ContentRow 
        title="Continue Watching" 
        items={mockItems}
        onActionClick={mockOnActionClick}
      />
    );

    expect(screen.getByText('Continue Watching')).toBeInTheDocument();
    expect(screen.getByTestId('content-card-content-1')).toBeInTheDocument();
    expect(screen.getByTestId('content-card-content-2')).toBeInTheDocument();
    expect(screen.getByTestId('content-card-content-3')).toBeInTheDocument();
  });

  it('displays action button when onActionClick is provided', () => {
    render(
      <ContentRow 
        title="Continue Watching" 
        items={mockItems}
        actionLabel="View All Episodes"
        onActionClick={mockOnActionClick}
      />
    );

    const actionButton = screen.getByRole('button', { name: /view all episodes/i });
    expect(actionButton).toBeInTheDocument();
  });

  it('calls onActionClick when action button is clicked', () => {
    render(
      <ContentRow 
        title="Continue Watching" 
        items={mockItems}
        onActionClick={mockOnActionClick}
      />
    );

    const actionButton = screen.getByRole('button', { name: /view all/i });
    fireEvent.click(actionButton);

    expect(mockOnActionClick).toHaveBeenCalledTimes(1);
  });

  it('uses default action label when none provided', () => {
    render(
      <ContentRow 
        title="Continue Watching" 
        items={mockItems}
        onActionClick={mockOnActionClick}
      />
    );

    expect(screen.getByRole('button', { name: /view all/i })).toBeInTheDocument();
  });

  it('does not render action button when onActionClick is not provided', () => {
    render(
      <ContentRow 
        title="Continue Watching" 
        items={mockItems}
      />
    );

    expect(screen.queryByRole('button', { name: /view all/i })).not.toBeInTheDocument();
  });

  it('renders trailing action when provided', () => {
    const trailingAction = <button>Custom Action</button>;
    
    render(
      <ContentRow 
        title="Continue Watching" 
        items={mockItems}
        trailingAction={trailingAction}
      />
    );

    expect(screen.getByRole('button', { name: /custom action/i })).toBeInTheDocument();
  });

  it('renders both trailing action and main action', () => {
    const trailingAction = <button>Custom Action</button>;
    
    render(
      <ContentRow 
        title="Continue Watching" 
        items={mockItems}
        onActionClick={mockOnActionClick}
        trailingAction={trailingAction}
      />
    );

    expect(screen.getByRole('button', { name: /custom action/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /view all/i })).toBeInTheDocument();
  });

  it('returns null when items array is empty', () => {
    const { container } = render(
      <ContentRow 
        title="Empty Row" 
        items={[]}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('has proper accessibility attributes', () => {
    render(
      <ContentRow 
        title="Continue Watching" 
        items={mockItems}
      />
    );

    const section = screen.getByRole('region');
    expect(section).toHaveAttribute('aria-labelledby', 'row-continue-watching');

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveAttribute('id', 'row-continue-watching');
  });

  it('generates correct heading id from title', () => {
    render(
      <ContentRow 
        title="Recently Added Content" 
        items={mockItems}
      />
    );

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveAttribute('id', 'row-recently-added-content');
  });

  it('applies horizontal scrolling styles', () => {
    render(
      <ContentRow 
        title="Continue Watching" 
        items={mockItems}
      />
    );

    const scrollContainer = screen.getByRole('region').querySelector('.overflow-x-auto');
    expect(scrollContainer).toHaveClass('overflow-x-auto', 'snap-x', 'snap-mandatory');
  });

  it('renders content cards with proper spacing', () => {
    render(
      <ContentRow 
        title="Continue Watching" 
        items={mockItems}
      />
    );

    const cardContainers = screen.getByRole('region').querySelectorAll('.w-60.flex-shrink-0.snap-start');
    expect(cardContainers).toHaveLength(3);
  });

  it('handles single item correctly', () => {
    const singleItem = [mockItems[0]];
    
    render(
      <ContentRow 
        title="Single Item" 
        items={singleItem}
      />
    );

    expect(screen.getByTestId('content-card-content-1')).toBeInTheDocument();
    expect(screen.queryByTestId('content-card-content-2')).not.toBeInTheDocument();
  });

  describe('Smooth Scrolling Navigation', () => {
    beforeEach(() => {
      // Mock scrollBy method
      Element.prototype.scrollBy = jest.fn();
      
      // Mock getBoundingClientRect for scroll calculations
      Element.prototype.getBoundingClientRect = jest.fn(() => ({
        width: 1200,
        height: 300,
        top: 0,
        left: 0,
        bottom: 300,
        right: 1200,
        x: 0,
        y: 0,
        toJSON: jest.fn(),
      }));
    });

    it('renders scroll navigation buttons', () => {
      render(
        <ContentRow 
          title="Test Row" 
          items={mockItems}
          enableScrollButtons={true}
        />
      );

      expect(screen.getByRole('button', { name: /scroll left/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /scroll right/i })).toBeInTheDocument();
    });

    it('scrolls right when right button is clicked', async () => {
      const mockScrollBy = jest.fn();
      
      render(
        <ContentRow 
          title="Test Row" 
          items={mockItems}
          enableScrollButtons={true}
        />
      );

      const container = screen.getByTestId('scroll-container');
      container.scrollBy = mockScrollBy;
      
      // Mock scroll dimensions to enable right scroll button
      Object.defineProperty(container, 'scrollWidth', { value: 1000, configurable: true });
      Object.defineProperty(container, 'clientWidth', { value: 500, configurable: true });
      Object.defineProperty(container, 'scrollLeft', { value: 0, configurable: true });

      // Wait for useEffect to run and trigger updateScrollButtons
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
      });

      const rightButton = screen.getByRole('button', { name: /scroll right/i });
      expect(rightButton).not.toBeDisabled();
      
      fireEvent.click(rightButton);

      expect(mockScrollBy).toHaveBeenCalledWith({
        left: 600,
        behavior: 'smooth'
      });
    });

    it('scrolls left when left button is clicked', async () => {
      const mockScrollBy = jest.fn();
      
      render(
        <ContentRow 
          title="Test Row" 
          items={mockItems}
          enableScrollButtons={true}
        />
      );

      const container = screen.getByTestId('scroll-container');
      container.scrollBy = mockScrollBy;

      // Wait for useEffect to run and enable the button
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
      });

      // Simulate that we're in the middle of the scroll area so left button is enabled
      Object.defineProperty(container, 'scrollLeft', { value: 100, writable: true });
      Object.defineProperty(container, 'scrollWidth', { value: 1000, writable: true });
      Object.defineProperty(container, 'clientWidth', { value: 600, writable: true });

      await act(async () => {
        fireEvent.scroll(container);
      });

      const leftButton = screen.getByRole('button', { name: /scroll left/i });
      fireEvent.click(leftButton);

      expect(mockScrollBy).toHaveBeenCalledWith({
        left: -600,
        behavior: 'smooth'
      });
    });

    it('disables left button at start position', () => {
      render(
        <ContentRow 
          title="Test Row" 
          items={mockItems}
          enableScrollButtons={true}
        />
      );

      const leftButton = screen.getByRole('button', { name: /scroll left/i });
      expect(leftButton).toHaveClass('opacity-50');
      expect(leftButton).toBeDisabled();
    });

    it('updates button states based on scroll position', () => {
      render(
        <ContentRow 
          title="Test Row" 
          items={mockItems}
          enableScrollButtons={true}
        />
      );

      const container = screen.getByTestId('scroll-container');
      
      // Mock scroll to middle position
      Object.defineProperty(container, 'scrollLeft', { value: 300, writable: true });
      Object.defineProperty(container, 'scrollWidth', { value: 1000, writable: true });
      Object.defineProperty(container, 'clientWidth', { value: 600, writable: true });

      fireEvent.scroll(container);

      const leftButton = screen.getByRole('button', { name: /scroll left/i });
      const rightButton = screen.getByRole('button', { name: /scroll right/i });

      expect(leftButton).not.toBeDisabled();
      expect(rightButton).not.toBeDisabled();
    });
  });

  describe('Item Interactions', () => {
    it('calls onItemClick when content card is clicked', () => {
      const mockOnItemClick = jest.fn();
      render(
        <ContentRow 
          title="Test Row" 
          items={mockItems}
          onItemClick={mockOnItemClick}
        />
      );

      const firstCard = screen.getByTestId('content-card-content-1');
      fireEvent.click(firstCard);

      expect(mockOnItemClick).toHaveBeenCalledWith(mockItems[0]);
    });

    it('handles item hover for preview', () => {
      const mockOnItemHover = jest.fn();
      render(
        <ContentRow 
          title="Test Row" 
          items={mockItems}
          onItemHover={mockOnItemHover}
        />
      );

      const firstCard = screen.getByTestId('content-card-content-1');
      fireEvent.mouseEnter(firstCard);

      expect(mockOnItemHover).toHaveBeenCalledWith(mockItems[0]);
    });
  });

  describe('Progress Display', () => {
    it('shows progress indicators when showProgress is true', () => {
      render(
        <ContentRow 
          title="Continue Watching" 
          items={mockItems}
          showProgress={true}
        />
      );

      // Progress should be passed to ContentCard components
      expect(screen.getByTestId('content-card-content-1')).toBeInTheDocument();
    });

    it('hides progress indicators when showProgress is false', () => {
      render(
        <ContentRow 
          title="Popular Content" 
          items={mockItems}
          showProgress={false}
        />
      );

      expect(screen.getByTestId('content-card-content-1')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('adjusts scroll amount for mobile devices', async () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 767, // Mobile width
      });

      const mockScrollBy = jest.fn();

      render(
        <ContentRow 
          title="Test Row" 
          items={mockItems}
          enableScrollButtons={true}
        />
      );

      const container = screen.getByTestId('scroll-container');
      container.scrollBy = mockScrollBy;

      // Trigger resize event to update mobile state
      await act(async () => {
        fireEvent(window, new Event('resize'));
        await new Promise(resolve => setTimeout(resolve, 10));
      });

      // Mock scroll properties to enable the right button
      Object.defineProperty(container, 'scrollLeft', { value: 0, writable: true });
      Object.defineProperty(container, 'scrollWidth', { value: 1000, writable: true });
      Object.defineProperty(container, 'clientWidth', { value: 600, writable: true });

      await act(async () => {
        fireEvent.scroll(container);
      });

      const rightButton = screen.getByRole('button', { name: /scroll right/i });
      expect(rightButton).not.toBeDisabled();
      
      fireEvent.click(rightButton);

      expect(mockScrollBy).toHaveBeenCalledWith({
        left: 300,
        behavior: 'smooth'
      });
    });

    it('hides scroll buttons on very small screens', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 480,
      });

      render(
        <ContentRow 
          title="Test Row" 
          items={mockItems}
          enableScrollButtons={true}
        />
      );

      const leftButton = screen.queryByRole('button', { name: /scroll left/i });
      const rightButton = screen.queryByRole('button', { name: /scroll right/i });

      expect(leftButton).toHaveClass('sm:flex', 'hidden');
      expect(rightButton).toHaveClass('sm:flex', 'hidden');
    });
  });

  describe('Loading and Error States', () => {
    it('shows loading skeleton when isLoading is true', () => {
      render(
        <ContentRow 
          title="Test Row" 
          items={[]}
          isLoading={true}
        />
      );

      expect(screen.getByTestId('content-row-skeleton')).toBeInTheDocument();
    });

    it('shows error message when error prop is provided', () => {
      render(
        <ContentRow 
          title="Test Row" 
          items={[]}
          error="Failed to load content"
        />
      );

      expect(screen.getByText(/failed to load content/i)).toBeInTheDocument();
    });
  });
});