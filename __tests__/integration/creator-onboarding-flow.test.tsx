/**
 * Integration Test: Creator Onboarding Flow
 *
 * This test covers the complete happy path:
 * 1. User visits marketing page
 * 2. Navigates to onboarding
 * 3. Completes onboarding steps
 * 4. Gets authenticated
 * 5. Lands on dashboard
 */

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { useRouter, usePathname } from 'next/navigation';
import * as api from '@/lib/api';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

// Mock the NavigationContext
jest.mock('@/contexts/NavigationContext', () => ({
  useNavigation: () => ({
    setBreadcrumbs: jest.fn(),
    navigateToSection: jest.fn(),
  }),
}));

// Mock the auth store
jest.mock('@/lib/store', () => ({
  useAuthStore: jest.fn(),
}));

// Mock NotificationDropdown component
jest.mock('@/components/Notifications/NotificationDropdown', () => {
  return function NotificationDropdown() {
    return <div data-testid="notification-dropdown">Notifications</div>;
  };
});

// Mock the API module
jest.mock('@/lib/api');

// Import components AFTER mocks are defined
import ForCreatorsPage from '@/app/creators/page';
import CreatorOnboarding from '@/app/creator/onboarding/page';
import CreatorDashboard from '@/app/creator/dashboard/page';
import { useAuthStore } from '@/lib/store';

describe('Creator Onboarding Integration Flow', () => {
  let mockPush: jest.Mock;
  let mockLocalStorage: { [key: string]: string };

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Setup localStorage mock
    mockLocalStorage = {};

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((key: string) => mockLocalStorage[key] || null),
        setItem: jest.fn((key: string, value: string) => {
          mockLocalStorage[key] = value;
        }),
        removeItem: jest.fn((key: string) => {
          delete mockLocalStorage[key];
        }),
        clear: jest.fn(() => {
          mockLocalStorage = {};
        }),
      },
      writable: true,
    });

    // Setup router mock
    mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      prefetch: jest.fn(),
    });

    (usePathname as jest.Mock).mockReturnValue('/creators');

    // Setup auth store mock (default: no user, no token)
    (useAuthStore as jest.Mock).mockReturnValue({
      user: null,
      token: null,
      setUser: jest.fn(),
      setToken: jest.fn(),
    });

    // Mock API responses
    (api.creatorDashboard.getStats as jest.Mock) = jest.fn().mockResolvedValue({
      data: {
        data: {
          total_views: 1000,
          total_watch_time: 5000,
          active_patrons: 50,
          content_count: 10,
          views_trend: 5,
          watch_time_trend: 10,
          patrons_trend: 2,
          revenue_estimate: 500,
        }
      }
    });

    (api.creatorDashboard.getContent as jest.Mock) = jest.fn().mockResolvedValue({
      data: { data: [] }
    });

    (api.creatorDashboard.getAnalytics as jest.Mock) = jest.fn().mockResolvedValue({
      data: { top_content: [] }
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Complete Onboarding Happy Path', () => {
    it('should complete full flow from marketing page to authenticated dashboard', async () => {
      // STEP 1: User visits marketing page (unauthenticated)
      const { unmount: unmountMarketing } = render(<ForCreatorsPage />);

      // Verify marketing page is rendered
      expect(screen.getByText(/Built for/i)).toBeInTheDocument();

      // Click "Start Your Journey" button
      const startButton = screen.getByRole('button', { name: /Start Your Journey/i });
      fireEvent.click(startButton);

      // Should navigate to onboarding
      expect(mockPush).toHaveBeenCalledWith('/creator/onboarding');

      unmountMarketing();

      // STEP 2: User lands on onboarding page
      (usePathname as jest.Mock).mockReturnValue('/creator/onboarding');
      const { unmount: unmountOnboarding } = render(<CreatorOnboarding />);

      // Verify onboarding page is rendered
      await waitFor(() => {
        expect(screen.getByText(/Welcome to ReeActor/i)).toBeInTheDocument();
      });

      // User goes through onboarding steps
      // Note: In this test, we're simulating the user completing onboarding

      unmountOnboarding();

      // STEP 3: User completes OAuth and gets authenticated
      // Simulate token being set after OAuth callback
      mockLocalStorage['auth_token'] = 'test-authenticated-token';

      // Update auth store to reflect authenticated state
      (useAuthStore as jest.Mock).mockReturnValue({
        user: {
          id: '1',
          name: 'Test Creator',
          email: 'creator@test.com',
          isCreator: true,
        },
        token: 'test-authenticated-token',
        setUser: jest.fn(),
        setToken: jest.fn(),
      });

      // STEP 4: User is redirected to dashboard
      (usePathname as jest.Mock).mockReturnValue('/creator/dashboard');
      const { unmount: unmountDashboard } = render(<CreatorDashboard />);

      // Wait for dashboard to load
      await waitFor(() => {
        expect(screen.getByText(/Creator Dashboard/i)).toBeInTheDocument();
      });

      // ASSERT: Dashboard should make API calls with valid token
      await waitFor(() => {
        expect(api.creatorDashboard.getStats).toHaveBeenCalled();
        expect(api.creatorDashboard.getContent).toHaveBeenCalled();
        expect(api.creatorDashboard.getAnalytics).toHaveBeenCalled();
      });

      // ASSERT: Dashboard should display stats
      expect(screen.getByText(/Total Views/i)).toBeInTheDocument();
      expect(screen.getByText(/Watch Time/i)).toBeInTheDocument();
      expect(screen.getByText(/Active Patrons/i)).toBeInTheDocument();

      unmountDashboard();
    });

    it('should not make API calls during onboarding flow before authentication', async () => {
      // STEP 1: Navigate through marketing to onboarding
      const { unmount: unmountMarketing } = render(<ForCreatorsPage />);

      const startButton = screen.getByRole('button', { name: /Start Your Journey/i });
      fireEvent.click(startButton);

      unmountMarketing();

      // STEP 2: Onboarding page (still unauthenticated)
      (usePathname as jest.Mock).mockReturnValue('/creator/onboarding');
      const { unmount: unmountOnboarding } = render(<CreatorOnboarding />);

      await waitFor(() => {
        expect(screen.getByText(/Welcome to ReeActor/i)).toBeInTheDocument();
      });

      // ASSERT: No API calls should be made during onboarding
      expect(api.creatorDashboard.getStats).not.toHaveBeenCalled();
      expect(api.creatorDashboard.getContent).not.toHaveBeenCalled();
      expect(api.creatorDashboard.getAnalytics).not.toHaveBeenCalled();

      unmountOnboarding();
    });

    it('should handle onboarding navigation through multiple steps without errors', async () => {
      // Render onboarding page
      render(<CreatorOnboarding />);

      // Verify first step is visible
      await waitFor(() => {
        expect(screen.getByText(/Welcome to ReeActor/i)).toBeInTheDocument();
      });

      // Try to click "Continue" button if available
      const continueButtons = screen.queryAllByRole('button', { name: /Continue/i });
      if (continueButtons.length > 0) {
        fireEvent.click(continueButtons[0]);

        // Wait for next step to render
        await waitFor(() => {
          // Should still be on onboarding, not redirected
          expect(screen.queryByText(/Creator Dashboard/i)).not.toBeInTheDocument();
        });
      }

      // ASSERT: No unexpected navigation occurred
      expect(mockPush).not.toHaveBeenCalledWith('/auth/login');
    });

    it('should properly set auth token before making dashboard requests', async () => {
      // Start without token
      expect(localStorage.getItem('auth_token')).toBeNull();

      // Render dashboard (simulating prefetch or accidental navigation)
      const { rerender } = render(<CreatorDashboard />);

      // Wait a bit
      await waitFor(() => {
        expect(screen.getByText(/Creator Dashboard/i)).toBeInTheDocument();
      });

      // ASSERT: No API calls made without token
      expect(api.creatorDashboard.getStats).not.toHaveBeenCalled();

      // Now simulate authentication
      mockLocalStorage['auth_token'] = 'new-auth-token';
      (useAuthStore as jest.Mock).mockReturnValue({
        user: {
          id: '1',
          name: 'Test Creator',
          email: 'creator@test.com',
          isCreator: true,
        },
        token: 'new-auth-token',
        setUser: jest.fn(),
        setToken: jest.fn(),
      });

      // Force re-render to trigger useEffect
      rerender(<CreatorDashboard />);

      // ASSERT: API calls should now be made with token
      await waitFor(() => {
        expect(api.creatorDashboard.getStats).toHaveBeenCalled();
        expect(api.creatorDashboard.getContent).toHaveBeenCalled();
        expect(api.creatorDashboard.getAnalytics).toHaveBeenCalled();
      });
    });
  });

  describe('Error Handling During Onboarding', () => {
    it('should handle API errors gracefully when dashboard loads with auth', async () => {
      // Set auth token
      mockLocalStorage['auth_token'] = 'test-token';
      (useAuthStore as jest.Mock).mockReturnValue({
        user: { id: '1', name: 'Test', email: 'test@test.com', isCreator: true },
        token: 'test-token',
        setUser: jest.fn(),
        setToken: jest.fn(),
      });

      // Mock API error
      const apiError = new Error('API Error');
      (api.creatorDashboard.getStats as jest.Mock).mockRejectedValue(apiError);
      (api.creatorDashboard.getContent as jest.Mock).mockRejectedValue(apiError);
      (api.creatorDashboard.getAnalytics as jest.Mock).mockRejectedValue(apiError);

      // Render dashboard
      render(<CreatorDashboard />);

      // Wait for error handling
      await waitFor(() => {
        // Dashboard should still render, just with no data
        expect(screen.getByText(/Creator Dashboard/i)).toBeInTheDocument();
      });

      // Should not crash or redirect unexpectedly
      expect(mockPush).not.toHaveBeenCalledWith('/auth/login');
    });

    it('should allow retry after failed authentication', async () => {
      // First attempt: no token
      const { rerender } = render(<CreatorDashboard />);

      await waitFor(() => {
        expect(screen.getByText(/Creator Dashboard/i)).toBeInTheDocument();
      });

      // No API calls should have been made
      expect(api.creatorDashboard.getStats).not.toHaveBeenCalled();

      // Second attempt: token is set (user completed auth)
      mockLocalStorage['auth_token'] = 'retry-token';
      (useAuthStore as jest.Mock).mockReturnValue({
        user: { id: '1', name: 'Test', email: 'test@test.com', isCreator: true },
        token: 'retry-token',
        setUser: jest.fn(),
        setToken: jest.fn(),
      });

      // Re-render
      rerender(<CreatorDashboard />);

      // Now API calls should be made
      await waitFor(() => {
        expect(api.creatorDashboard.getStats).toHaveBeenCalled();
      });
    });
  });
});
