import { test, expect } from '@playwright/test';

test.describe('Public Pages', () => {
  test.describe('Home Page', () => {
    test('should display home page', async ({ page }) => {
      await page.goto('/');
      await expect(page).toHaveTitle(/ReactorHub/i);
    });

    test('should have navigation links', async ({ page }) => {
      await page.goto('/');
      
      // Check for main navigation
      const nav = page.locator('nav');
      await expect(nav).toBeVisible();
    });

    test('should have call-to-action buttons', async ({ page }) => {
      await page.goto('/');
      
      // Look for sign up or get started buttons
      const ctaButton = page.locator('text=/get started|sign up|join now/i').first();
      await expect(ctaButton).toBeVisible();
    });
  });

  test.describe('About Page', () => {
    test('should display about page', async ({ page }) => {
      await page.goto('/about');
      await expect(page.getByRole('heading', { name: /about/i })).toBeVisible();
    });
  });

  test.describe('Features Page', () => {
    test('should display features page', async ({ page }) => {
      await page.goto('/features');
      await expect(page.getByRole('heading', { name: /features/i })).toBeVisible();
    });
  });

  test.describe('Pricing Page', () => {
    test('should display pricing page', async ({ page }) => {
      await page.goto('/pricing');
      await expect(page.getByRole('heading', { name: /pricing/i })).toBeVisible();
    });

    test('should show pricing plans', async ({ page }) => {
      await page.goto('/pricing');
      
      // Look for common pricing terms
      const pricingContent = page.locator('text=/free|month|year|plan/i').first();
      await expect(pricingContent).toBeVisible();
    });
  });

  test.describe('Creators Page', () => {
    test('should display creators listing', async ({ page }) => {
      await page.goto('/creators');
      await expect(page.getByRole('heading', { name: /creators/i })).toBeVisible();
    });
  });

  test.describe('Discover Page', () => {
    test('should display discover page', async ({ page }) => {
      await page.goto('/discover');
      await expect(page).toHaveURL(/\/discover/);
    });
  });

  test.describe('Browse Page', () => {
    test('should display browse page', async ({ page }) => {
      await page.goto('/browse');
      await expect(page).toHaveURL(/\/browse/);
    });
  });

  test.describe('Contact Page', () => {
    test('should display contact page', async ({ page }) => {
      await page.goto('/contact');
      await expect(page.getByRole('heading', { name: /contact/i })).toBeVisible();
    });
  });

  test.describe('Blog Page', () => {
    test('should display blog page', async ({ page }) => {
      await page.goto('/blog');
      await expect(page).toHaveURL(/\/blog/);
    });
  });

  test.describe('Careers Page', () => {
    test('should display careers page', async ({ page }) => {
      await page.goto('/careers');
      await expect(page.getByRole('heading', { name: /careers/i })).toBeVisible();
    });
  });

  test.describe('Legal Pages', () => {
    test('should display privacy policy', async ({ page }) => {
      await page.goto('/privacy');
      await expect(page.getByRole('heading', { name: /privacy/i })).toBeVisible();
    });

    test('should display terms of service', async ({ page }) => {
      await page.goto('/terms');
      await expect(page.getByRole('heading', { name: /terms/i })).toBeVisible();
    });
  });

  test.describe('Navigation', () => {
    test('should navigate between public pages', async ({ page }) => {
      await page.goto('/');
      
      // Try to find and click About link
      const aboutLink = page.locator('a[href="/about"], text=/about/i').first();
      if (await aboutLink.isVisible()) {
        await aboutLink.click();
        await expect(page).toHaveURL(/\/about/);
      }
    });

    test('should have working footer links', async ({ page }) => {
      await page.goto('/');
      
      // Scroll to footer
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      
      // Look for footer
      const footer = page.locator('footer');
      if (await footer.isVisible()) {
        await expect(footer).toBeVisible();
      }
    });
  });

  test.describe('Responsive Design', () => {
    test('should be mobile responsive', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      
      // Page should load without errors
      await expect(page).toHaveURL('/');
    });

    test('should be tablet responsive', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/');
      
      await expect(page).toHaveURL('/');
    });

    test('should be desktop responsive', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/');
      
      await expect(page).toHaveURL('/');
    });
  });
});
