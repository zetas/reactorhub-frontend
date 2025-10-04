import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ContinueWatching } from '../ContinueWatching';
import { useContinueWatching } from '@/hooks/useContinueWatching';
import userEvent from '@testing-library/user-event';

// Mock the hook
jest.mock('@/hooks/useContinueWatching');
const mockUseContinueWatching = useContinueWatching as jest.MockedFunction<typeof useContinueWatching>;

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={createQueryClient()}>
    {children}
  </QueryClientProvider>
);

describe('ContinueWatching', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading skeletons when loading', () => {
    mockUseContinueWatching.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch: jest.fn(),
    } as any);

    render(<ContinueWatching />, { wrapper });

    expect(screen.getByText('Continue Watching')).toBeInTheDocument();
    expect(screen.getByText('Pick up where you left off')).toBeInTheDocument();
  });

  it('renders watch cards when data is loaded', async () => {
    const mockData = {
      sessions: [
        {
          content_id: '123',
          title: 'Test Video',
          thumbnail_url: 'https://example.com/thumb.jpg',
          progress: 150,
          total: 300,
          percentage: 50,
          last_watched: '2025-10-03T12:00:00Z',
          creator_name: 'Test Creator',
        },
      ],
      total_count: 1,
      limit: 12,
    };

    mockUseContinueWatching.mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
    } as any);

    render(<ContinueWatching />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText('Test Video')).toBeInTheDocument();
      expect(screen.getByText('Test Creator')).toBeInTheDocument();
    });
  });

  it('renders error state when there is an error', () => {
    const mockError = new Error('Failed to fetch');

    mockUseContinueWatching.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: mockError,
      refetch: jest.fn(),
    } as any);

    render(<ContinueWatching />, { wrapper });

    expect(screen.getByText('Failed to load continue watching')).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('calls refetch when retry button is clicked', async () => {
    const mockRefetch = jest.fn();
    const user = userEvent.setup();

    mockUseContinueWatching.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Failed'),
      refetch: mockRefetch,
    } as any);

    render(<ContinueWatching />, { wrapper });

    const retryButton = screen.getByText('Try Again');
    await user.click(retryButton);

    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it('does not render when there are no sessions and not loading', () => {
    mockUseContinueWatching.mockReturnValue({
      data: { sessions: [], total_count: 0, limit: 12 },
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
    } as any);

    const { container } = render(<ContinueWatching />, { wrapper });

    expect(container.firstChild).toBeNull();
  });

  it('shows auto-refresh indicator when data is loaded', () => {
    mockUseContinueWatching.mockReturnValue({
      data: {
        sessions: [
          {
            content_id: '123',
            title: 'Test Video',
            thumbnail_url: null,
            progress: 150,
            total: 300,
            percentage: 50,
            last_watched: '2025-10-03T12:00:00Z',
            creator_name: 'Test Creator',
          },
        ],
        total_count: 1,
        limit: 12,
      },
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
    } as any);

    render(<ContinueWatching />, { wrapper });

    expect(screen.getByText('Auto-refreshes every 30 seconds')).toBeInTheDocument();
  });
});
