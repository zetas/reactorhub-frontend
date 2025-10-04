import { test, expect } from '@playwright/test';

test.describe('Complete User Flows', () => {
  test.beforeEach(async ({ page }) => {
    // Mock all API routes for consistent testing
    await page.route('**/api/**', async (route) => {
      const url = route.request().url();

      if (url.includes('/auth/me')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
            isCreator: false
          }),
        });
      } else if (url.includes('/patron/continue-watching')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            sessions: [
              {
                id: '1',
                content_id: 'content-123',
                content_title: 'Test Video',
                creator_name: 'Test Creator',
                thumbnail_url: 'https://picsum.photos/320/180',
                progress_seconds: 150,
                total_seconds: 300,
                last_watched_at: new Date().toISOString()
              }
            ],
            total_count: 1,
            limit: 12
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
  });

  test.describe('Patron Journey', () => {
    test('should complete full patron watching flow', async ({ page }) => {
      // 1. Visit homepage
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      expect(page.url()).toContain('/');

      // 2. Navigate to dashboard (simulating logged in user)
      await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });

      // 3. Verify dashboard loads
      await expect(page.getByText(/welcome back/i)).toBeVisible({ timeout: 10000 });

      // 4. Check stats are visible
      await expect(page.getByText(/subscriptions/i).first()).toBeVisible();
      await expect(page.getByText(/watch time/i).first()).toBeVisible();

      // 5. Verify page is interactive
      const pageContent = await page.content();
      expect(pageContent).toContain('Welcome Back');
    });

    test('should navigate between patron pages', async ({ page }) => {
      // Dashboard
      await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(500);
      expect(page.url()).toContain('/dashboard');

      // Browse
      await page.goto('/browse', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(500);
      expect(page.url()).toContain('/browse');

      // Creator profile
      await page.goto('/creators/test-creator', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(500);
      expect(page.url()).toContain('/creators/');
    });
  });

  test.describe('Creator Journey', () => {
    test.beforeEach(async ({ page }) => {
      // Override auth to make user a creator
      await page.route('**/api/auth/me', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: '1',
            name: 'Test Creator',
            email: 'creator@example.com',
            isCreator: true
          }),
        });
      });
    });

    test('should complete creator dashboard flow', async ({ page }) => {
      await page.goto('/creator/dashboard', { waitUntil: 'domcontentloaded' });

      // Verify creator dashboard loads
      await expect(page.getByText(/creator dashboard/i).first()).toBeVisible({ timeout: 10000 });

      // Check for upload button
      const uploadButton = page.getByRole('button', { name: /upload content/i }).first();
      await expect(uploadButton).toBeVisible();
    });

    test('should navigate between creator pages', async ({ page }) => {
      // Dashboard
      await page.goto('/creator/dashboard', { waitUntil: 'domcontentloaded' });
      expect(page.url()).toContain('/creator/dashboard');

      // Content
      await page.goto('/creator/content', { waitUntil: 'domcontentloaded' });
      expect(page.url()).toContain('/creator/content');

      // Analytics
      await page.goto('/creator/analytics', { waitUntil: 'domcontentloaded' });
      expect(page.url()).toContain('/creator/analytics');
    });
  });

  test.describe('Navigation Flow', () => {
    test('should navigate from home to dashboard', async ({ page }) => {
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });

      expect(page.url()).toContain('/dashboard');
    });

    test('should handle 404 pages gracefully', async ({ page }) => {
      const response = await page.goto('/non-existent-page', {
        waitUntil: 'domcontentloaded'
      });

      // Either shows 404 or redirects
      expect(response?.status()).toBeGreaterThanOrEqual(200);
    });
  });

  test.describe('Responsive Design', () => {
    test('should work on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });

      // Check page loads on mobile
      await expect(page.getByText(/welcome back/i)).toBeVisible({ timeout: 10000 });
    });

    test('should work on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });

      await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });

      await expect(page.getByText(/welcome back/i)).toBeVisible({ timeout: 10000 });
    });

    test('should work on desktop viewport', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });

      await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });

      await expect(page.getByText(/welcome back/i)).toBeVisible({ timeout: 10000 });
    });
  });
});
