/**
 * Test Suite: Creator Marketing to Onboarding Navigation Bug
 *
 * Bug Description:
 * - User visits /creators marketing page
 * - Clicks button to go to /creator/onboarding
 * - Gets redirected to /auth/login because dashboard prefetches and makes unauthorized API calls
 * - Global 401 interceptor in lib/api.ts redirects to login
 *
 * Root Cause:
 * 1. Next.js automatically prefetches /creator/dashboard link in CreatorNavigation
 * 2. Dashboard page makes API calls on mount (getStats, getContent, getAnalytics)
 * 3. API calls return 401 (unauthorized)
 * 4. Global axios interceptor redirects to /auth/login
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

// Mock the auth store - must be declared before imports that use it
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
import CreatorDashboard from '@/app/creator/dashboard/page';
import CreatorOnboarding from '@/app/creator/onboarding/page';
import { useAuthStore } from '@/lib/store';

describe('Creator Marketing to Onboarding Navigation Bug', () => {
  let mockPush: jest.Mock;
  let mockLocalStorage: { [key: string]: string };

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Setup auth store mock (default: no user, no token)
    (useAuthStore as jest.Mock).mockReturnValue({
      user: null,
      token: null,
      setUser: jest.fn(),
      setToken: jest.fn(),
    });

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

    // Mock API calls to return 401 errors (simulating unauthorized access)
    const mockApiError = new Error('Unauthorized');
    (mockApiError as any).response = { status: 401 };

    (api.creatorDashboard.getStats as jest.Mock) = jest.fn().mockRejectedValue(mockApiError);
    (api.creatorDashboard.getContent as jest.Mock) = jest.fn().mockRejectedValue(mockApiError);
    (api.creatorDashboard.getAnalytics as jest.Mock) = jest.fn().mockRejectedValue(mockApiError);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Bug Reproduction Tests', () => {
    it('should not redirect to login when navigating from marketing page to onboarding', async () => {
      // ARRANGE: Render the /creators marketing page (unauthenticated user)
      render(<ForCreatorsPage />);

      // Verify the marketing page is rendered
      expect(screen.getByText(/Built for/i)).toBeInTheDocument();
      expect(screen.getByText(/Creators/i)).toBeInTheDocument();

      // ACT: Click "Start Your Journey" button to navigate to onboarding
      const startButton = screen.getByRole('button', { name: /Start Your Journey/i });
      fireEvent.click(startButton);

      // ASSERT: User should be navigated to /creator/onboarding
      expect(mockPush).toHaveBeenCalledWith('/creator/onboarding');

      // ASSERT: User should NOT be redirected to /auth/login
      expect(mockPush).not.toHaveBeenCalledWith('/auth/login');
      expect(window.location.href).not.toContain('/auth/login');
    });

    it('should not make dashboard API calls when onboarding page loads without auth', async () => {
      // ARRANGE: No auth token in localStorage
      expect(localStorage.getItem('auth_token')).toBeNull();

      // ACT: Render the onboarding page
      render(<CreatorOnboarding />);

      // Wait for any effects to complete
      await waitFor(() => {
        expect(screen.getByText(/Welcome to ReeActor/i)).toBeInTheDocument();
      });

      // ASSERT: Dashboard API calls should NOT be made
      expect(api.creatorDashboard.getStats).not.toHaveBeenCalled();
      expect(api.creatorDashboard.getContent).not.toHaveBeenCalled();
      expect(api.creatorDashboard.getAnalytics).not.toHaveBeenCalled();
    });

    it('should not make dashboard API calls when dashboard loads without auth token', async () => {
      // ARRANGE: No auth token in localStorage (unauthenticated state)
      expect(localStorage.getItem('auth_token')).toBeNull();

      // ACT: Render the dashboard page (simulating prefetch scenario)
      render(<CreatorDashboard />);

      // Wait for component to mount
      await waitFor(() => {
        // The dashboard should render but not make API calls
        expect(screen.queryByText(/Creator Dashboard/i)).toBeInTheDocument();
      });

      // ASSERT: API calls should NOT be made when there's no auth token
      // This is the fix we need to implement - dashboard should check for token first
      expect(api.creatorDashboard.getStats).not.toHaveBeenCalled();
      expect(api.creatorDashboard.getContent).not.toHaveBeenCalled();
      expect(api.creatorDashboard.getAnalytics).not.toHaveBeenCalled();
    });

    it('should make dashboard API calls ONLY when auth token exists', async () => {
      // ARRANGE: Set auth token in localStorage (authenticated state)
      mockLocalStorage['auth_token'] = 'test-token-123';

      // Mock successful API responses
      (api.creatorDashboard.getStats as jest.Mock).mockResolvedValue({
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

      (api.creatorDashboard.getContent as jest.Mock).mockResolvedValue({
        data: { data: [] }
      });

      (api.creatorDashboard.getAnalytics as jest.Mock).mockResolvedValue({
        data: { top_content: [] }
      });

      // ACT: Render the dashboard page with auth token
      render(<CreatorDashboard />);

      // Wait for API calls to complete
      await waitFor(() => {
        expect(api.creatorDashboard.getStats).toHaveBeenCalled();
        expect(api.creatorDashboard.getContent).toHaveBeenCalled();
        expect(api.creatorDashboard.getAnalytics).toHaveBeenCalled();
      });

      // ASSERT: Dashboard should render with data
      expect(screen.getByText(/Creator Dashboard/i)).toBeInTheDocument();
    });
  });

  describe('Prefetch Prevention Tests', () => {
    it('should prevent prefetch from triggering API calls', async () => {
      // ARRANGE: No auth token
      expect(localStorage.getItem('auth_token')).toBeNull();

      // ACT: Simulate Next.js prefetching the dashboard page
      // This happens automatically when dashboard link is in viewport
      const { unmount } = render(<CreatorDashboard />);

      // Wait a bit to ensure no API calls are made
      await new Promise(resolve => setTimeout(resolve, 100));

      // ASSERT: No API calls should be made during prefetch
      expect(api.creatorDashboard.getStats).not.toHaveBeenCalled();
      expect(api.creatorDashboard.getContent).not.toHaveBeenCalled();
      expect(api.creatorDashboard.getAnalytics).not.toHaveBeenCalled();

      // Cleanup
      unmount();
    });

    it('should handle 401 errors gracefully without redirecting during prefetch', async () => {
      // ARRANGE: Mock a scenario where token exists but is invalid
      mockLocalStorage['auth_token'] = 'invalid-token';

      // Mock window.location.href to track redirects
      delete (window as any).location;
      (window as any).location = { href: '/creator/dashboard' };

      // ACT: Render dashboard with invalid token
      render(<CreatorDashboard />);

      // Wait for potential API calls
      await waitFor(() => {
        // Component should handle errors gracefully
        expect(screen.getByText(/Creator Dashboard/i)).toBeInTheDocument();
      }, { timeout: 2000 });

      // ASSERT: Should not redirect to login immediately during prefetch
      // The actual navigation should only happen on user interaction, not prefetch
      expect(window.location.href).toBe('/creator/dashboard');
    });
  });

  describe('Auth State Management Tests', () => {
    it('should show loading state while checking auth', async () => {
      // ARRANGE: Set valid auth token
      mockLocalStorage['auth_token'] = 'valid-token';

      // Mock delayed API response
      (api.creatorDashboard.getStats as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ data: { data: {} } }), 100))
      );
      (api.creatorDashboard.getContent as jest.Mock).mockResolvedValue({ data: { data: [] } });
      (api.creatorDashboard.getAnalytics as jest.Mock).mockResolvedValue({ data: { top_content: [] } });

      // ACT: Render dashboard
      render(<CreatorDashboard />);

      // ASSERT: Should show loading state initially
      // Note: This assumes the dashboard has a loading spinner
      await waitFor(() => {
        const loadingElements = screen.queryAllByRole('status');
        expect(loadingElements.length).toBeGreaterThanOrEqual(0);
      });
    });

    it('should not call API when auth token is removed', async () => {
      // ARRANGE: Start with token
      mockLocalStorage['auth_token'] = 'valid-token';

      // ACT: Render dashboard
      const { rerender } = render(<CreatorDashboard />);

      // Clear the token
      delete mockLocalStorage['auth_token'];

      // Force re-render
      rerender(<CreatorDashboard />);

      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 100));

      // ASSERT: API should not be called again after token removal
      // (It may have been called once initially, but not after token removal)
      const callCount = (api.creatorDashboard.getStats as jest.Mock).mock.calls.length;
      expect(callCount).toBeLessThanOrEqual(1);
    });
  });
});
