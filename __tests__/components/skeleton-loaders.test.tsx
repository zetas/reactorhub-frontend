import React from 'react';
import { render, screen } from '../utils/test-utils';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';

describe('Phase 3 - Skeleton Loaders & Loading States', () => {
  const createTestQueryClient = () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        },
      },
    });

  describe('Skeleton Components', () => {
    const SkeletonCard = () => (
      <div className="animate-pulse" role="status" aria-label="Loading content">
        <div className="h-48 bg-gray-300 rounded-lg" />
        <div className="mt-4 space-y-3">
          <div className="h-4 bg-gray-300 rounded w-3/4" />
          <div className="h-4 bg-gray-300 rounded w-1/2" />
        </div>
      </div>
    );

    it('should render skeleton loader', () => {
      render(<SkeletonCard />);

      const skeleton = screen.getByRole('status');
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveAttribute('aria-label', 'Loading content');
    });

    it('should have animate-pulse class', () => {
      render(<SkeletonCard />);

      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('animate-pulse');
    });

    it('should be accessible to screen readers', () => {
      render(<SkeletonCard />);

      const skeleton = screen.getByLabelText('Loading content');
      expect(skeleton).toBeInTheDocument();
    });
  });

  describe('Multiple Skeleton Items', () => {
    const SkeletonList = ({ count }: { count: number }) => (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse flex space-x-4"
            role="status"
            aria-label={`Loading item ${index + 1}`}
          >
            <div className="rounded-full bg-gray-300 h-12 w-12" />
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-300 rounded w-3/4" />
              <div className="h-4 bg-gray-300 rounded w-5/6" />
            </div>
          </div>
        ))}
      </div>
    );

    it('should render multiple skeleton items', () => {
      render(<SkeletonList count={3} />);

      const skeletons = screen.getAllByRole('status');
      expect(skeletons).toHaveLength(3);
    });

    it('should have unique labels for each skeleton', () => {
      render(<SkeletonList count={2} />);

      expect(screen.getByLabelText('Loading item 1')).toBeInTheDocument();
      expect(screen.getByLabelText('Loading item 2')).toBeInTheDocument();
    });
  });

  describe('Content Card Skeleton', () => {
    const ContentCardSkeleton = () => (
      <div className="bg-gray-900 rounded-lg overflow-hidden animate-pulse" role="status">
        <span className="sr-only">Loading video card</span>
        <div className="aspect-video bg-gray-700" />
        <div className="p-4 space-y-3">
          <div className="h-5 bg-gray-700 rounded w-3/4" />
          <div className="h-4 bg-gray-700 rounded w-1/2" />
          <div className="flex gap-2">
            <div className="h-3 bg-gray-700 rounded w-16" />
            <div className="h-3 bg-gray-700 rounded w-20" />
          </div>
        </div>
      </div>
    );

    it('should render video card skeleton', () => {
      render(<ContentCardSkeleton />);

      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText('Loading video card')).toBeInTheDocument();
    });

    it('should use sr-only for screen reader text', () => {
      render(<ContentCardSkeleton />);

      const srText = screen.getByText('Loading video card');
      expect(srText).toHaveClass('sr-only');
    });

    it('should have proper aspect ratio', () => {
      const { container } = render(<ContentCardSkeleton />);

      const aspectDiv = container.querySelector('.aspect-video');
      expect(aspectDiv).toBeInTheDocument();
      expect(aspectDiv).toHaveClass('bg-gray-700');
    });
  });

  describe('Loading State Transitions', () => {
    const LoadingContent = ({ isLoading, data }: { isLoading: boolean; data?: any }) => {
      if (isLoading) {
        return (
          <div role="status" aria-live="polite" aria-label="Loading">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-48 mb-4" />
              <div className="h-4 bg-gray-300 rounded w-full" />
            </div>
          </div>
        );
      }

      return <div>{data?.title || 'Content loaded'}</div>;
    };

    it('should show skeleton when loading', () => {
      render(<LoadingContent isLoading={true} />);

      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveAttribute('aria-live', 'polite');
      expect(skeleton).toHaveClass('animate-pulse');
    });

    it('should show content when loaded', () => {
      render(<LoadingContent isLoading={false} data={{ title: 'Test Content' }} />);

      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should transition from loading to content', () => {
      const { rerender } = render(<LoadingContent isLoading={true} />);

      expect(screen.getByRole('status')).toBeInTheDocument();

      rerender(<LoadingContent isLoading={false} data={{ title: 'Loaded' }} />);

      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      expect(screen.getByText('Loaded')).toBeInTheDocument();
    });
  });

  describe('Spinner Loading States', () => {
    const Spinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
      const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
      };

      return (
        <div role="status" aria-label="Loading">
          <svg
            className={`animate-spin ${sizeClasses[size]}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      );
    };

    it('should render spinner with correct size', () => {
      const { rerender } = render(<Spinner size="sm" />);
      let svg = document.querySelector('svg');
      expect(svg).toHaveClass('h-4', 'w-4');

      rerender(<Spinner size="md" />);
      svg = document.querySelector('svg');
      expect(svg).toHaveClass('h-8', 'w-8');

      rerender(<Spinner size="lg" />);
      svg = document.querySelector('svg');
      expect(svg).toHaveClass('h-12', 'w-12');
    });

    it('should have animate-spin class', () => {
      render(<Spinner />);

      const svg = document.querySelector('svg');
      expect(svg).toHaveClass('animate-spin');
    });

    it('should have screen reader text', () => {
      render(<Spinner />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.getByText('Loading...')).toHaveClass('sr-only');
    });
  });

  describe('React Query Loading States', () => {
    const QueryLoadingComponent = () => {
      const { data, isLoading, isFetching } = useQuery({
        queryKey: ['test-data'],
        queryFn: async () => {
          return { message: 'Data loaded' };
        },
      });

      if (isLoading) {
        return (
          <div role="status" aria-label="Loading data">
            <div className="animate-pulse">Loading initial data...</div>
          </div>
        );
      }

      return (
        <div>
          <p>{data?.message}</p>
          {isFetching && (
            <span role="status" aria-label="Updating">
              Updating...
            </span>
          )}
        </div>
      );
    };

    it('should show loading state initially', async () => {
      const queryClient = createTestQueryClient();
      render(
        <QueryClientProvider client={queryClient}>
          <QueryLoadingComponent />
        </QueryClientProvider>
      );

      expect(screen.getByLabelText('Loading data')).toBeInTheDocument();
      expect(screen.getByText('Loading initial data...')).toBeInTheDocument();
    });

    it('should show content after loading', async () => {
      const queryClient = createTestQueryClient();
      render(
        <QueryClientProvider client={queryClient}>
          <QueryLoadingComponent />
        </QueryClientProvider>
      );

      await screen.findByText('Data loaded');
      expect(screen.getByText('Data loaded')).toBeInTheDocument();
    });
  });

  describe('Progressive Loading', () => {
    const ProgressiveLoader = ({ stage }: { stage: 1 | 2 | 3 | 'complete' }) => {
      if (stage === 'complete') {
        return <div>All content loaded</div>;
      }

      return (
        <div role="status" aria-live="polite">
          <p>Loading step {stage} of 3...</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(stage / 3) * 100}%` }}
              aria-label={`Progress: ${Math.round((stage / 3) * 100)}%`}
            />
          </div>
        </div>
      );
    };

    it('should show progress at different stages', () => {
      const { rerender } = render(<ProgressiveLoader stage={1} />);

      expect(screen.getByText('Loading step 1 of 3...')).toBeInTheDocument();
      expect(screen.getByLabelText(/progress: 33%/i)).toBeInTheDocument();

      rerender(<ProgressiveLoader stage={2} />);
      expect(screen.getByText('Loading step 2 of 3...')).toBeInTheDocument();
      expect(screen.getByLabelText(/progress: 66%/i)).toBeInTheDocument();

      rerender(<ProgressiveLoader stage={3} />);
      expect(screen.getByText('Loading step 3 of 3...')).toBeInTheDocument();
      expect(screen.getByLabelText(/progress: 100%/i)).toBeInTheDocument();
    });

    it('should show completion state', () => {
      render(<ProgressiveLoader stage="complete" />);

      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      expect(screen.getByText('All content loaded')).toBeInTheDocument();
    });
  });

  describe('Skeleton Accessibility', () => {
    it('should announce loading state to screen readers', () => {
      render(
        <div role="status" aria-live="polite" aria-busy="true">
          <span className="sr-only">Loading content, please wait</span>
          <div className="animate-pulse h-20 bg-gray-300" />
        </div>
      );

      const status = screen.getByRole('status');
      expect(status).toHaveAttribute('aria-live', 'polite');
      expect(status).toHaveAttribute('aria-busy', 'true');
      expect(screen.getByText('Loading content, please wait')).toBeInTheDocument();
    });

    it('should use semantic HTML for loading states', () => {
      render(
        <section aria-busy="true" aria-describedby="loading-desc">
          <p id="loading-desc" className="sr-only">
            Loading your dashboard
          </p>
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-300 rounded" />
            <div className="h-32 bg-gray-300 rounded" />
          </div>
        </section>
      );

      const section = document.querySelector('section');
      expect(section).toHaveAttribute('aria-busy', 'true');
      expect(section).toHaveAttribute('aria-describedby', 'loading-desc');
    });
  });

  describe('Loading Button States', () => {
    const LoadingButton = ({ isLoading, children }: { isLoading: boolean; children: React.ReactNode }) => (
      <button
        disabled={isLoading}
        aria-busy={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-4 w-4 inline-block mr-2" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
            </svg>
            <span>Processing...</span>
          </>
        ) : (
          children
        )}
      </button>
    );

    it('should show loading state in button', () => {
      render(<LoadingButton isLoading={true}>Submit</LoadingButton>);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(screen.getByText('Processing...')).toBeInTheDocument();
    });

    it('should show normal state when not loading', () => {
      render(<LoadingButton isLoading={false}>Submit</LoadingButton>);

      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
      expect(button).toHaveAttribute('aria-busy', 'false');
      expect(screen.getByText('Submit')).toBeInTheDocument();
    });
  });
});
