import { test, expect } from '@playwright/test';

test.describe('Continue Watching', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the API response
    await page.route('**/api/v1/patron/continue-watching*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          sessions: [
            {
              content_id: '123e4567-e89b-12d3-a456-426614174000',
              title: 'Test Video 1',
              thumbnail_url: 'https://via.placeholder.com/320x180',
              progress: 150,
              total: 300,
              percentage: 50,
              last_watched: '2025-10-03T12:00:00Z',
              creator_name: 'Test Creator',
              youtube_id: 'abc123',
            },
            {
              content_id: '223e4567-e89b-12d3-a456-426614174001',
              title: 'Test Video 2',
              thumbnail_url: 'https://via.placeholder.com/320x180',
              progress: 200,
              total: 400,
              percentage: 50,
              last_watched: '2025-10-03T11:00:00Z',
              creator_name: 'Another Creator',
              series_name: 'Test Series',
              season_number: 1,
              episode_number: 5,
            },
          ],
          total_count: 2,
          limit: 12,
        }),
      });
    });

    // Navigate to dashboard
    await page.goto('/dashboard');
  });

  test('should display Continue Watching section', async ({ page }) => {
    // Wait for the section to be visible
    await expect(page.getByRole('heading', { name: 'Continue Watching' })).toBeVisible();
    await expect(page.getByText('Pick up where you left off')).toBeVisible();
  });

  test('should display watch cards with progress bars', async ({ page }) => {
    // Wait for cards to load
    await expect(page.getByText('Test Video 1')).toBeVisible();
    await expect(page.getByText('Test Video 2')).toBeVisible();

    // Check creator names are displayed
    await expect(page.getByText('Test Creator')).toBeVisible();
    await expect(page.getByText('Another Creator')).toBeVisible();

    // Verify progress bars are present (they have role="progressbar")
    const progressBars = page.locator('[role="progressbar"]');
    await expect(progressBars).toHaveCount(2);
  });

  test('should navigate to video when card is clicked', async ({ page }) => {
    // Click on the first video card
    const firstCard = page.getByText('Test Video 1').locator('..');
    await firstCard.click();

    // Should navigate to watch page with progress timestamp
    await expect(page).toHaveURL(/\/watch\/123e4567-e89b-12d3-a456-426614174000\?t=150/);
  });

  test('should show auto-refresh indicator', async ({ page }) => {
    await expect(page.getByText('Auto-refreshes every 30 seconds')).toBeVisible();
  });

  test('should handle error state', async ({ page }) => {
    // Override the route to return an error
    await page.route('**/api/v1/patron/continue-watching*', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' }),
      });
    });

    // Reload the page to trigger the error
    await page.reload();

    // Should display error message
    await expect(page.getByText('Failed to load continue watching')).toBeVisible();
    await expect(page.getByText('Try Again')).toBeVisible();
  });

  test('should retry on error button click', async ({ page }) => {
    // First, trigger an error
    await page.route('**/api/v1/patron/continue-watching*', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' }),
      });
    });

    await page.reload();
    await expect(page.getByText('Try Again')).toBeVisible();

    // Now mock a successful response
    await page.route('**/api/v1/patron/continue-watching*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          sessions: [
            {
              content_id: '123e4567-e89b-12d3-a456-426614174000',
              title: 'Test Video 1',
              thumbnail_url: 'https://via.placeholder.com/320x180',
              progress: 150,
              total: 300,
              percentage: 50,
              last_watched: '2025-10-03T12:00:00Z',
              creator_name: 'Test Creator',
            },
          ],
          total_count: 1,
          limit: 12,
        }),
      });
    });

    // Click retry button
    await page.getByText('Try Again').click();

    // Should show the video after retry
    await expect(page.getByText('Test Video 1')).toBeVisible();
  });

  test('should not render when no sessions available', async ({ page }) => {
    // Mock empty sessions
    await page.route('**/api/v1/patron/continue-watching*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          sessions: [],
          total_count: 0,
          limit: 12,
        }),
      });
    });

    await page.reload();

    // Continue Watching section should not be visible
    await expect(page.getByRole('heading', { name: 'Continue Watching' })).not.toBeVisible();
  });

  test('should display series information when available', async ({ page }) => {
    // The second video has series information
    await expect(page.getByText('Test Series')).toBeVisible();
    await expect(page.getByText('S1 E5')).toBeVisible();
  });

  test('should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByText('Continue Watching')).toBeVisible();
    await expect(page.getByText('Test Video 1')).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.getByText('Test Video 1')).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.getByText('Test Video 1')).toBeVisible();
  });
});
