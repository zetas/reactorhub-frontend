import { test, expect } from '@playwright/test';

test.describe('Dashboard Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API responses
    await page.route('**/api/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {},
          sessions: [],
          total_count: 0
        }),
      });
    });
  });

  test('patron dashboard should load', async ({ page }) => {
    const response = await page.goto('/dashboard', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    expect(response?.status()).toBeLessThan(400);

    // Just check the page loaded - don't check for specific elements
    const content = await page.content();
    expect(content.length).toBeGreaterThan(100);
  });

  test('creator dashboard should load', async ({ page }) => {
    const response = await page.goto('/creator/dashboard', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    expect(response?.status()).toBeLessThan(400);

    const content = await page.content();
    expect(content.length).toBeGreaterThan(100);
  });

  test('patron extended dashboard should load', async ({ page }) => {
    const response = await page.goto('/patron/dashboard', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    expect(response?.status()).toBeLessThan(400);

    const content = await page.content();
    expect(content.length).toBeGreaterThan(100);
  });
});
