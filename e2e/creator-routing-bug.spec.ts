/**
 * E2E Test: Creator Marketing to Onboarding Flow
 *
 * This test reproduces the bug where:
 * 1. User visits /creators marketing page
 * 2. Clicks "Start Your Journey" or "Get Started"
 * 3. Should land on /creator/onboarding
 * 4. Bug: Gets redirected to /auth/login due to prefetch triggering unauthorized API calls
 */

import { test, expect } from '@playwright/test';

test.describe('Creator Marketing to Onboarding Flow', () => {
  test.beforeEach(async ({ context }) => {
    // Clear all cookies and storage before each test
    await context.clearCookies();
    await context.clearPermissions();
  });

  test('should navigate from marketing page to onboarding without login redirect', async ({ page }) => {
    // ARRANGE: Navigate to creators marketing page as unauthenticated user
    await page.goto('/creators');

    // Verify we're on the marketing page
    await expect(page).toHaveURL('/creators');
    await expect(page.getByText(/Built for/i)).toBeVisible();
    await expect(page.getByText(/Creators/i)).toBeVisible();

    // ACT: Click "Start Your Journey" button
    const startButton = page.getByRole('button', { name: /Start Your Journey/i });
    await expect(startButton).toBeVisible();
    await startButton.click();

    // ASSERT: Should navigate to onboarding page
    await expect(page).toHaveURL('/creator/onboarding');

    // ASSERT: Should see onboarding content
    await expect(page.getByText(/Welcome to ReeActor/i)).toBeVisible();

    // ASSERT: Should NOT be redirected to login
    await expect(page).not.toHaveURL('/auth/login');

    // Wait a bit to ensure no delayed redirects occur
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL('/creator/onboarding');
  });

  test('should navigate from CTA section to onboarding without login redirect', async ({ page }) => {
    // ARRANGE: Navigate to creators marketing page
    await page.goto('/creators');

    // Scroll to the CTA section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // ACT: Click "Get Started Free" button in CTA section
    const getStartedButton = page.getByRole('button', { name: /Get Started Free/i });
    await expect(getStartedButton).toBeVisible();
    await getStartedButton.click();

    // ASSERT: Should navigate to onboarding
    await expect(page).toHaveURL('/creator/onboarding');
    await expect(page.getByText(/Welcome to ReeActor/i)).toBeVisible();

    // ASSERT: Should NOT redirect to login
    await expect(page).not.toHaveURL('/auth/login');
  });

  test('should not make unauthorized API calls during navigation', async ({ page }) => {
    // ARRANGE: Set up network monitoring
    const apiCalls: string[] = [];
    const unauthorizedCalls: string[] = [];

    page.on('request', request => {
      const url = request.url();
      if (url.includes('/api/v1/creator/')) {
        apiCalls.push(url);
      }
    });

    page.on('response', async response => {
      const url = response.url();
      if (url.includes('/api/v1/creator/') && response.status() === 401) {
        unauthorizedCalls.push(url);
      }
    });

    // ACT: Navigate through the flow
    await page.goto('/creators');
    await page.getByRole('button', { name: /Start Your Journey/i }).click();
    await page.waitForURL('/creator/onboarding');

    // Wait for potential prefetch requests
    await page.waitForTimeout(1000);

    // ASSERT: Should not have made unauthorized API calls
    expect(unauthorizedCalls.length).toBe(0);

    // If API calls were made, they should have been prevented or handled gracefully
    console.log('API calls made:', apiCalls);
    console.log('Unauthorized calls:', unauthorizedCalls);
  });

  test('should not trigger dashboard prefetch when viewing marketing page', async ({ page }) => {
    // ARRANGE: Track network requests
    const dashboardRequests: string[] = [];

    page.on('request', request => {
      const url = request.url();
      if (url.includes('/creator/dashboard') || url.includes('/creator/stats') || url.includes('/creator/analytics')) {
        dashboardRequests.push(url);
      }
    });

    // ACT: View marketing page and wait
    await page.goto('/creators');
    await page.waitForTimeout(2000);

    // ASSERT: No dashboard-related requests should be made
    expect(dashboardRequests.length).toBe(0);
  });

  test('should complete full onboarding flow without authentication issues', async ({ page }) => {
    // ARRANGE: Navigate to marketing page
    await page.goto('/creators');

    // ACT: Click through to onboarding
    await page.getByRole('button', { name: /Start Your Journey/i }).click();
    await expect(page).toHaveURL('/creator/onboarding');

    // Verify onboarding steps are visible
    await expect(page.getByText(/Welcome to ReeActor/i)).toBeVisible();

    // Check that we can interact with onboarding steps
    const continueButton = page.getByRole('button', { name: /Continue/i });
    if (await continueButton.isVisible()) {
      await continueButton.click();

      // Should move to next step without redirect
      await expect(page).toHaveURL('/creator/onboarding');
      await expect(page).not.toHaveURL('/auth/login');
    }

    // ASSERT: Should remain on onboarding through the flow
    await expect(page).toHaveURL('/creator/onboarding');
  });

  test('should handle browser back button without authentication errors', async ({ page }) => {
    // ARRANGE: Navigate from marketing to onboarding
    await page.goto('/creators');
    await page.getByRole('button', { name: /Start Your Journey/i }).click();
    await expect(page).toHaveURL('/creator/onboarding');

    // ACT: Click browser back button
    await page.goBack();

    // ASSERT: Should return to marketing page
    await expect(page).toHaveURL('/creators');
    await expect(page.getByText(/Built for/i)).toBeVisible();

    // ASSERT: Should not redirect to login
    await expect(page).not.toHaveURL('/auth/login');
  });

  test('should not cache unauthorized responses', async ({ page }) => {
    // ARRANGE: Track response caching
    const responseStatuses: { [url: string]: number[] } = {};

    page.on('response', async response => {
      const url = response.url();
      if (url.includes('/api/v1/creator/')) {
        if (!responseStatuses[url]) {
          responseStatuses[url] = [];
        }
        responseStatuses[url].push(response.status());
      }
    });

    // ACT: Navigate to marketing page, then onboarding, then back
    await page.goto('/creators');
    await page.getByRole('button', { name: /Start Your Journey/i }).click();
    await expect(page).toHaveURL('/creator/onboarding');

    await page.goBack();
    await expect(page).toHaveURL('/creators');

    await page.getByRole('button', { name: /Start Your Journey/i }).click();
    await expect(page).toHaveURL('/creator/onboarding');

    // Wait for potential requests
    await page.waitForTimeout(1000);

    // ASSERT: Check that no 401s were encountered
    Object.entries(responseStatuses).forEach(([url, statuses]) => {
      const has401 = statuses.includes(401);
      if (has401) {
        console.warn(`401 responses found for ${url}:`, statuses);
      }
      expect(has401).toBe(false);
    });
  });
});

test.describe('Creator Dashboard Access Control', () => {
  test('should prevent direct dashboard access without authentication', async ({ page }) => {
    // ARRANGE: Clear all authentication
    await page.context().clearCookies();

    // ACT: Try to access dashboard directly
    await page.goto('/creator/dashboard');

    // ASSERT: Should either show empty state or redirect appropriately
    // Should NOT crash or cause infinite redirects
    await page.waitForLoadState('networkidle');

    // The page should handle the unauthenticated state gracefully
    const currentUrl = page.url();
    console.log('Current URL after direct dashboard access:', currentUrl);

    // Should not be stuck in a redirect loop
    await page.waitForTimeout(1000);
    const finalUrl = page.url();
    expect(finalUrl).toBe(currentUrl); // URL should be stable
  });

  test('should not make API calls when accessing dashboard without auth', async ({ page }) => {
    // ARRANGE: Monitor API calls
    const unauthorizedCalls: string[] = [];

    page.on('response', async response => {
      if (response.url().includes('/api/v1/creator/') && response.status() === 401) {
        unauthorizedCalls.push(response.url());
      }
    });

    // ACT: Access dashboard without auth
    await page.context().clearCookies();
    await page.goto('/creator/dashboard');
    await page.waitForLoadState('networkidle');

    // ASSERT: Should not make unauthorized API calls
    expect(unauthorizedCalls.length).toBe(0);
  });
});
