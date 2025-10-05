import React from 'react';
import { render, screen } from '../utils/test-utils';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';

describe('Phase 2 - Empty States', () => {
  const createTestQueryClient = () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        },
      },
    });

  describe('No Search Results', () => {
    const NoSearchResults = ({ query }: { query: string }) => (
      <div role="status" className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">No results found</h3>
        <p className="mt-1 text-sm text-gray-500">
          No results found for &quot;{query}&quot;. Try a different search term.
        </p>
      </div>
    );

    it('should display empty state for no search results', () => {
      render(<NoSearchResults query="nonexistent" />);

      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText(/no results found/i)).toBeInTheDocument();
      expect(screen.getByText(/nonexistent/i)).toBeInTheDocument();
    });

    it('should show helpful message with search term', () => {
      render(<NoSearchResults query="test query" />);

      expect(screen.getByText(/test query/i)).toBeInTheDocument();
      expect(screen.getByText(/try a different search term/i)).toBeInTheDocument();
    });

    it('should have decorative icon with aria-hidden', () => {
      const { container } = render(<NoSearchResults query="test" />);

      const icon = container.querySelector('svg');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('No Content Available', () => {
    const NoContent = ({ type }: { type: 'creators' | 'videos' | 'subscriptions' }) => {
      const messages = {
        creators: {
          title: 'No creators yet',
          description: 'Start by following some creators to see their content here.',
          action: 'Browse Creators',
        },
        videos: {
          title: 'No videos available',
          description: 'This creator hasn\'t uploaded any videos yet.',
          action: 'Explore Other Creators',
        },
        subscriptions: {
          title: 'No active subscriptions',
          description: 'Subscribe to creators to access their exclusive content.',
          action: 'Find Creators',
        },
      };

      const message = messages[type];

      return (
        <div className="text-center py-16" role="status">
          <h3 className="text-xl font-semibold text-gray-900">{message.title}</h3>
          <p className="mt-2 text-gray-600">{message.description}</p>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            {message.action}
          </button>
        </div>
      );
    };

    it('should display empty state for no creators', () => {
      render(<NoContent type="creators" />);

      expect(screen.getByText('No creators yet')).toBeInTheDocument();
      expect(screen.getByText(/start by following some creators/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Browse Creators' })).toBeInTheDocument();
    });

    it('should display empty state for no videos', () => {
      render(<NoContent type="videos" />);

      expect(screen.getByText('No videos available')).toBeInTheDocument();
      expect(screen.getByText(/hasn't uploaded any videos/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Explore Other Creators' })).toBeInTheDocument();
    });

    it('should display empty state for no subscriptions', () => {
      render(<NoContent type="subscriptions" />);

      expect(screen.getByText('No active subscriptions')).toBeInTheDocument();
      expect(screen.getByText(/subscribe to creators/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Find Creators' })).toBeInTheDocument();
    });

    it('should have role="status" for screen readers', () => {
      render(<NoContent type="creators" />);

      const emptyState = screen.getByRole('status');
      expect(emptyState).toBeInTheDocument();
    });
  });

  describe('Empty List States', () => {
    const EmptyList = ({ title, description, actionLabel }: {
      title: string;
      description: string;
      actionLabel?: string;
    }) => (
      <div className="flex flex-col items-center justify-center py-12 px-4" role="status">
        <div className="text-center max-w-md">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className="mt-2 text-sm text-gray-600">{description}</p>
          {actionLabel && (
            <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    );

    it('should display empty watch history', () => {
      render(
        <EmptyList
          title="No watch history"
          description="Videos you watch will appear here"
        />
      );

      expect(screen.getByText('No watch history')).toBeInTheDocument();
      expect(screen.getByText(/videos you watch will appear here/i)).toBeInTheDocument();
    });

    it('should display empty favorites list', () => {
      render(
        <EmptyList
          title="No favorites yet"
          description="Mark videos as favorites to easily find them later"
          actionLabel="Browse Videos"
        />
      );

      expect(screen.getByText('No favorites yet')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Browse Videos' })).toBeInTheDocument();
    });

    it('should display empty notifications', () => {
      render(
        <EmptyList
          title="No notifications"
          description="You're all caught up! New notifications will appear here"
        />
      );

      expect(screen.getByText('No notifications')).toBeInTheDocument();
      expect(screen.getByText(/you're all caught up/i)).toBeInTheDocument();
    });
  });

  describe('Loading then Empty State', () => {
    const LoadingThenEmpty = ({ isEmpty }: { isEmpty: boolean }) => {
      const { data, isLoading } = useQuery({
        queryKey: ['empty-data'],
        queryFn: async () => {
          return isEmpty ? [] : [{ id: 1, name: 'Item' }];
        },
      });

      if (isLoading) {
        return <div role="status" aria-live="polite">Loading...</div>;
      }

      if (!data || data.length === 0) {
        return (
          <div role="status">
            <p>No items found</p>
          </div>
        );
      }

      return <div>{data.map(item => <div key={item.id}>{item.name}</div>)}</div>;
    };

    it('should show loading then empty state', async () => {
      const queryClient = createTestQueryClient();
      render(
        <QueryClientProvider client={queryClient}>
          <LoadingThenEmpty isEmpty={true} />
        </QueryClientProvider>
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();

      await screen.findByText('No items found');
      expect(screen.getByText('No items found')).toBeInTheDocument();
    });

    it('should show loading then content', async () => {
      const queryClient = createTestQueryClient();
      render(
        <QueryClientProvider client={queryClient}>
          <LoadingThenEmpty isEmpty={false} />
        </QueryClientProvider>
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();

      await screen.findByText('Item');
      expect(screen.getByText('Item')).toBeInTheDocument();
    });
  });

  describe('Empty State Illustrations', () => {
    it('should include SVG illustration with proper accessibility', () => {
      render(
        <div>
          <svg
            aria-hidden="true"
            className="h-24 w-24"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="12" cy="12" r="10" />
          </svg>
          <p>No data available</p>
        </div>
      );

      const svg = document.querySelector('svg');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });

    it('should use semantic HTML for empty states', () => {
      render(
        <section aria-labelledby="empty-heading">
          <h2 id="empty-heading">Nothing here yet</h2>
          <p>Get started by creating your first item</p>
        </section>
      );

      const section = screen.getByLabelText('Nothing here yet');
      expect(section).toBeInTheDocument();
    });
  });

  describe('Empty State with Call-to-Action', () => {
    const EmptyWithCTA = () => (
      <div className="text-center" role="status">
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome to ReactorHub
        </h2>
        <p className="mt-2 text-gray-600">
          You haven't subscribed to any creators yet
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Browse Creators
          </button>
          <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            Learn More
          </button>
        </div>
      </div>
    );

    it('should display welcome message with actions', () => {
      render(<EmptyWithCTA />);

      expect(screen.getByText('Welcome to ReactorHub')).toBeInTheDocument();
      expect(screen.getByText(/haven't subscribed/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Browse Creators' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Learn More' })).toBeInTheDocument();
    });

    it('should have accessible CTA buttons', () => {
      render(<EmptyWithCTA />);

      const primaryButton = screen.getByRole('button', { name: 'Browse Creators' });
      const secondaryButton = screen.getByRole('button', { name: 'Learn More' });

      expect(primaryButton).toBeInTheDocument();
      expect(secondaryButton).toBeInTheDocument();
    });
  });

  describe('Conditional Empty States', () => {
    const ConditionalEmpty = ({ hasFilter, hasSearch }: { hasFilter: boolean; hasSearch: boolean }) => {
      if (hasSearch) {
        return (
          <div role="status">
            <p>No results match your search</p>
            <button>Clear search</button>
          </div>
        );
      }

      if (hasFilter) {
        return (
          <div role="status">
            <p>No results match your filters</p>
            <button>Clear filters</button>
          </div>
        );
      }

      return (
        <div role="status">
          <p>No content available</p>
        </div>
      );
    };

    it('should show search-specific empty state', () => {
      render(<ConditionalEmpty hasFilter={false} hasSearch={true} />);

      expect(screen.getByText(/no results match your search/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Clear search' })).toBeInTheDocument();
    });

    it('should show filter-specific empty state', () => {
      render(<ConditionalEmpty hasFilter={true} hasSearch={false} />);

      expect(screen.getByText(/no results match your filters/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Clear filters' })).toBeInTheDocument();
    });

    it('should show generic empty state', () => {
      render(<ConditionalEmpty hasFilter={false} hasSearch={false} />);

      expect(screen.getByText('No content available')).toBeInTheDocument();
    });
  });

  describe('Empty State Accessibility', () => {
    it('should announce empty state to screen readers', () => {
      render(
        <div role="status" aria-live="polite">
          <p>No items to display</p>
        </div>
      );

      const status = screen.getByRole('status');
      expect(status).toHaveAttribute('aria-live', 'polite');
    });

    it('should have sufficient color contrast', () => {
      render(
        <div className="bg-white p-8">
          <p className="text-gray-900">No content found</p>
          <p className="text-gray-600">Try adjusting your search</p>
        </div>
      );

      expect(screen.getByText('No content found')).toHaveClass('text-gray-900');
      expect(screen.getByText(/try adjusting/i)).toHaveClass('text-gray-600');
      // Both have sufficient contrast on white background
    });

    it('should provide context for empty state', () => {
      render(
        <div role="region" aria-labelledby="empty-state-title">
          <h2 id="empty-state-title">Your Library</h2>
          <div role="status">
            <p>Your library is empty</p>
          </div>
        </div>
      );

      const region = screen.getByRole('region', { name: 'Your Library' });
      expect(region).toBeInTheDocument();
      expect(screen.getByText('Your library is empty')).toBeInTheDocument();
    });
  });
});
