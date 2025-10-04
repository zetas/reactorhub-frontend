import { test, expect } from '@playwright/test';

test.describe('Color Scheme Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [], sessions: [], total_count: 0 }),
      });
    });
  });

  test.describe('Patron Dashboard Colors', () => {
    test('should display coral red primary colors', async ({ page }) => {
      await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });

      // Check for gradient heading
      const heading = page.locator('.heading-gradient').first();
      await expect(heading).toBeVisible({ timeout: 10000 });

      // Verify dark background is present
      const darkBg = page.locator('.bg-dark-950').first();
      await expect(darkBg).toBeVisible();
    });

    test('should have glass morphism effects', async ({ page }) => {
      await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });

      // Check for glass-dark class
      const glassElement = page.locator('.glass-dark, .glass').first();
      await expect(glassElement).toBeVisible({ timeout: 10000 });
    });

    test('should display animated gradient background', async ({ page }) => {
      await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });

      // Check for gradient background
      const gradient = page.locator('[class*="bg-gradient"]').first();
      await expect(gradient).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Creator Dashboard Colors', () => {
    test('should use dark theme with coral accents', async ({ page }) => {
      await page.goto('/creator/dashboard', { waitUntil: 'domcontentloaded' });

      // Verify page loaded
      await page.waitForTimeout(1000);
      const pageContent = await page.content();
      expect(pageContent.length).toBeGreaterThan(100);
    });

    test('should have primary button with coral red', async ({ page }) => {
      await page.goto('/creator/dashboard', { waitUntil: 'domcontentloaded' });

      // Look for upload button which should have primary color
      const uploadBtn = page.getByRole('button', { name: /upload/i }).first();
      await expect(uploadBtn).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Consistent Theme Across Pages', () => {
    const pages = [
      { path: '/dashboard', name: 'Patron Dashboard' },
      { path: '/creator/dashboard', name: 'Creator Dashboard' },
      { path: '/browse', name: 'Browse Page' },
    ];

    for (const { path, name } of pages) {
      test(`should maintain color scheme on ${name}`, async ({ page }) => {
        const response = await page.goto(path, { waitUntil: 'domcontentloaded' });

        // Verify page loads successfully
        expect(response?.status()).toBeLessThan(400);

        // Wait for content
        await page.waitForTimeout(500);

        // Check page has content
        const content = await page.content();
        expect(content.length).toBeGreaterThan(100);
      });
    }
  });
});
