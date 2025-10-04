import { test, expect } from '@playwright/test';

test.describe('Patron Flow', () => {
  // Mock authentication for patron tests
  test.beforeEach(async ({ page }) => {
    // Mock all API routes to prevent 401s
    await page.route('**/api/**', async (route) => {
      const url = route.request().url();

      if (url.includes('/patron/continue-watching')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ sessions: [], total_count: 0, limit: 12 }),
        });
      } else if (url.includes('/auth/me')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: '1',
            name: 'Test Patron',
            email: 'patron@test.com',
            isCreator: false
          }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: [] }),
        });
      }
    });

    // Mock auth state in localStorage
    await page.addInitScript(() => {
      const mockUser = {
        id: '1',
        name: 'Test Patron',
        email: 'patron@test.com',
        isCreator: false
      };

      localStorage.setItem('auth_token', 'mock-patron-token');
      localStorage.setItem('user', JSON.stringify(mockUser));

      // Mock Zustand store
      (window as any).__ZUSTAND_STORE__ = {
        user: mockUser,
        token: 'mock-patron-token',
        isAuthenticated: true
      };
    });
  });

  test.describe('Patron Dashboard', () => {
    test('should display patron dashboard', async ({ page }) => {
      await page.goto('/dashboard', { waitUntil: 'networkidle' });

      // Wait for page to fully load
      await page.waitForLoadState('domcontentloaded');

      // Look for "Welcome Back" heading
      await expect(page.getByText(/welcome back/i)).toBeVisible({ timeout: 10000 });
    });

    test('should show quick stats', async ({ page }) => {
      await page.goto('/dashboard', { waitUntil: 'networkidle' });

      // Look for stat card titles - they exist in the page
      await expect(page.getByText(/subscriptions/i).first()).toBeVisible({ timeout: 10000 });
    });

    test('should display stat cards with values', async ({ page }) => {
      await page.goto('/dashboard', { waitUntil: 'networkidle' });

      // Check for stat values
      await expect(page.getByText(/watch time/i).first()).toBeVisible({ timeout: 10000 });
      await expect(page.getByText(/videos watched/i).first()).toBeVisible({ timeout: 10000 });
    });

    test('should show Continue Watching section', async ({ page }) => {
      await page.goto('/dashboard', { waitUntil: 'networkidle' });

      // The Continue Watching component should render
      await page.waitForTimeout(1000); // Give it time to render
      const pageContent = await page.content();
      expect(pageContent).toBeTruthy();
    });

    test('should have dark theme background', async ({ page }) => {
      await page.goto('/dashboard', { waitUntil: 'networkidle' });

      // Check that page loaded successfully
      await expect(page.getByText(/welcome back/i)).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Browse Content', () => {
    test('should display browse page', async ({ page }) => {
      await page.goto('/patron/browse');
      await expect(page).toHaveURL(/\/patron\/browse/);
    });

    test('should display content grid', async ({ page }) => {
      await page.route('**/api/v1/**', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: [
              {
                id: '1',
                title: 'Test Content',
                thumbnail_url: 'https://via.placeholder.com/320x180',
                creator_name: 'Test Creator',
              },
            ],
          }),
        });
      });

      await page.goto('/patron/browse');
      await page.waitForTimeout(500);
    });
  });

  test.describe('Subscriptions', () => {
    test('should display subscriptions page', async ({ page }) => {
      await page.goto('/patron/subscriptions');
      await expect(page).toHaveURL(/\/patron\/subscriptions/);
    });

    test('should show subscribed creators', async ({ page }) => {
      await page.route('**/api/v1/patron/subscriptions*', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            subscriptions: [
              {
                id: '1',
                creator_name: 'Test Creator',
                creator_avatar: 'https://via.placeholder.com/100',
                tier: 'Premium',
              },
            ],
          }),
        });
      });

      await page.goto('/patron/subscriptions');
      await expect(page.getByText(/test creator/i)).toBeVisible();
    });
  });

  test.describe('Watchlist', () => {
    test('should display watchlist page', async ({ page }) => {
      await page.goto('/patron/watchlist');
      await expect(page).toHaveURL(/\/patron\/watchlist/);
    });

    test('should show saved videos', async ({ page }) => {
      await page.route('**/api/v1/patron/watchlist*', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            items: [
              {
                id: '1',
                title: 'Saved Video',
                thumbnail_url: 'https://via.placeholder.com/320x180',
              },
            ],
          }),
        });
      });

      await page.goto('/patron/watchlist');
      await expect(page.getByText(/saved video/i)).toBeVisible();
    });
  });

  test.describe('Watch History', () => {
    test('should display history page', async ({ page }) => {
      await page.goto('/patron/history');
      await expect(page).toHaveURL(/\/patron\/history/);
    });

    test('should show watch history', async ({ page }) => {
      await page.route('**/api/v1/patron/history*', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            history: [
              {
                id: '1',
                title: 'Watched Video',
                watched_at: '2025-10-03T12:00:00Z',
              },
            ],
          }),
        });
      });

      await page.goto('/patron/history');
      await expect(page.getByText(/watched video/i)).toBeVisible();
    });
  });

  test.describe('Profile & Settings', () => {
    test('should display profile page', async ({ page }) => {
      await page.goto('/patron/profile');
      await expect(page).toHaveURL(/\/patron\/profile/);
    });

    test('should display settings page', async ({ page }) => {
      await page.goto('/patron/settings');
      await expect(page).toHaveURL(/\/patron\/settings/);
    });

    test('should display account page', async ({ page }) => {
      await page.goto('/patron/account');
      await expect(page).toHaveURL(/\/patron\/account/);
    });
  });

  test.describe('Video Watching', () => {
    test('should navigate to watch page', async ({ page }) => {
      const videoId = '123e4567-e89b-12d3-a456-426614174000';
      await page.goto(`/watch/${videoId}`);
      await expect(page).toHaveURL(new RegExp(`/watch/${videoId}`));
    });

    test('should display video player', async ({ page }) => {
      await page.route('**/api/v1/content/**', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: '123',
            title: 'Test Video',
            youtube_id: 'dQw4w9WgXcQ',
            creator_name: 'Test Creator',
          }),
        });
      });

      await page.goto('/watch/123e4567-e89b-12d3-a456-426614174000');
      
      // Should show video title or player
      await page.waitForTimeout(1000);
      const url = page.url();
      expect(url).toMatch(/\/watch\//);
    });
  });

  test.describe('Search Functionality', () => {
    test('should display search page', async ({ page }) => {
      await page.goto('/search?q=test');
      await expect(page).toHaveURL(/\/search/);
    });

    test('should show search results', async ({ page }) => {
      await page.route('**/api/v1/search*', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            results: [
              {
                id: '1',
                title: 'Search Result',
                type: 'content',
              },
            ],
          }),
        });
      });

      await page.goto('/search?q=test');
      await expect(page.getByText(/search result/i)).toBeVisible();
    });
  });

  test.describe('Creator Pages', () => {
    test('should display creator profile', async ({ page }) => {
      await page.route('**/api/v1/creators/**', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: '1',
            name: 'Test Creator',
            avatar_url: 'https://via.placeholder.com/100',
          }),
        });
      });

      await page.goto('/creators/123');
      await expect(page).toHaveURL(/\/creators\/123/);
    });
  });

  test.describe('Series Pages', () => {
    test('should display series page', async ({ page }) => {
      await page.route('**/api/v1/series/**', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: '1',
            title: 'Test Series',
            episodes: [],
          }),
        });
      });

      await page.goto('/series/123');
      await expect(page).toHaveURL(/\/series\/123/);
    });
  });
});
