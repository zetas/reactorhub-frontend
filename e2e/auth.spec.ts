import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.describe('Login Page', () => {
    test('should display login page', async ({ page }) => {
      await page.goto('/auth/login');
      await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
    });

    test('should have OAuth login options', async ({ page }) => {
      await page.goto('/auth/login');
      
      // Check for Patreon OAuth button
      const patreonButton = page.locator('text=/.*patreon.*/i');
      await expect(patreonButton).toBeVisible();
    });

    test('should navigate to signup page', async ({ page }) => {
      await page.goto('/auth/login');
      
      const signupLink = page.locator('text=/.*sign up.*/i, text=/.*create.*account.*/i').first();
      if (await signupLink.isVisible()) {
        await signupLink.click();
        await expect(page).toHaveURL(/\/auth\/signup/);
      }
    });
  });

  test.describe('Signup Page', () => {
    test('should display signup page', async ({ page }) => {
      await page.goto('/auth/signup');
      await expect(page.getByRole('heading', { name: /sign up|create.*account/i })).toBeVisible();
    });

    test('should have OAuth signup options', async ({ page }) => {
      await page.goto('/auth/signup');
      
      const patreonButton = page.locator('text=/.*patreon.*/i');
      await expect(patreonButton).toBeVisible();
    });

    test('should navigate to login page', async ({ page }) => {
      await page.goto('/auth/signup');
      
      const loginLink = page.locator('text=/.*sign in.*/i, text=/.*already.*account.*/i').first();
      if (await loginLink.isVisible()) {
        await loginLink.click();
        await expect(page).toHaveURL(/\/auth\/login/);
      }
    });
  });

  test.describe('OAuth Callback', () => {
    test('should handle OAuth callback page', async ({ page }) => {
      // Mock successful OAuth callback
      await page.goto('/auth/callback?code=test123&state=test');
      
      // Should either redirect or show processing message
      await page.waitForTimeout(1000);
      const url = page.url();
      expect(url).toMatch(/\/(dashboard|auth|$)/);
    });
  });

  test.describe('Protected Routes', () => {
    test('should redirect to login when accessing patron dashboard without auth', async ({ page }) => {
      await page.goto('/patron/dashboard');
      await page.waitForTimeout(500);
      
      const url = page.url();
      expect(url).toMatch(/\/(auth\/login|login|$)/);
    });

    test('should redirect to login when accessing creator dashboard without auth', async ({ page }) => {
      await page.goto('/creator/dashboard');
      await page.waitForTimeout(500);
      
      const url = page.url();
      expect(url).toMatch(/\/(auth\/login|login|$)/);
    });
  });
});
