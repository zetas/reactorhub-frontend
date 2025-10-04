import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import PatronDashboard from '@/app/patron/dashboard/page';
import { useAuthStore } from '@/lib/store';
import { patron, creators } from '@/lib/api';

// Mock dependencies
jest.mock('next/navigation');
jest.mock('@/lib/store');
jest.mock('@/lib/api');

const mockPush = jest.fn();

beforeEach(() => {
  (useRouter as jest.Mock).mockReturnValue({
    push: mockPush,
  });
  
  // Mock API responses
  (patron.getContinueWatching as jest.Mock).mockResolvedValue({ data: [] });
  (patron.getRecentlyWatched as jest.Mock).mockResolvedValue({ data: [] });
  (creators.list as jest.Mock).mockResolvedValue({ data: [] });
  
  jest.clearAllMocks();
});

describe('Patron Dashboard Welcome Message', () => {
  it('should show personalized welcome when user has name', async () => {
    (useAuthStore as jest.Mock).mockReturnValue({
      user: { id: '1', name: 'John Doe', isCreator: false },
      token: 'mock-token',
      clearAuth: jest.fn(),
    });

    render(<PatronDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Welcome, John Doe!')).toBeInTheDocument();
    });
  });

  it('should show generic welcome when user has no name', async () => {
    (useAuthStore as jest.Mock).mockReturnValue({
      user: { id: '1', name: '', isCreator: false },
      token: 'mock-token',
      clearAuth: jest.fn(),
    });

    render(<PatronDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Welcome to ReactorHub!')).toBeInTheDocument();
    });
  });

  it('should show generic welcome when user name is null', async () => {
    (useAuthStore as jest.Mock).mockReturnValue({
      user: { id: '1', name: null, isCreator: false },
      token: 'mock-token',
      clearAuth: jest.fn(),
    });

    render(<PatronDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Welcome to ReactorHub!')).toBeInTheDocument();
    });
  });

  it('should not show "welcome back" for any user', async () => {
    (useAuthStore as jest.Mock).mockReturnValue({
      user: { id: '1', name: 'John Doe', isCreator: false },
      token: 'mock-token',
      clearAuth: jest.fn(),
    });

    render(<PatronDashboard />);

    await waitFor(() => {
      expect(screen.queryByText(/welcome back/i)).not.toBeInTheDocument();
    });
  });

  it('should show no mock recommended content for new users', async () => {
    (useAuthStore as jest.Mock).mockReturnValue({
      user: { id: '1', name: 'John Doe', isCreator: false },
      token: 'mock-token',
      clearAuth: jest.fn(),
    });

    render(<PatronDashboard />);

    await waitFor(() => {
      // These were the mock content titles that should no longer appear
      expect(screen.queryByText('Breaking Bad 1x1 REACTION')).not.toBeInTheDocument();
      expect(screen.queryByText('Game of Thrones 8x6 Finale REACTION')).not.toBeInTheDocument();
      expect(screen.queryByText('The Last of Us Episode 3 - EMOTIONAL')).not.toBeInTheDocument();
    });
  });
});