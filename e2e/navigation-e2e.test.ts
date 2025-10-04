import { test, expect } from '@playwright/test';

test.describe('Navigation System', () => {
  test.beforeEach(async ({ page }) => {
    // Start from the home page
    await page.goto('http://localhost:3000');
  });

  test('should display home navigation on landing page', async ({ page }) => {
    // Check that home navigation is visible
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.getByText('ReactorHub')).toBeVisible();
    await expect(page.getByText('For Creators')).toBeVisible();
    await expect(page.getByText('For Patrons')).toBeVisible();
    await expect(page.getByText('Pricing')).toBeVisible();
    await expect(page.getByText('Login')).toBeVisible();
    await expect(page.getByText('Get Started')).toBeVisible();
  });

  test('should navigate to patron dashboard and show patron navigation', async ({ page }) => {
    // Navigate to patron dashboard
    await page.goto('http://localhost:3000/dashboard');
    
    // Check that patron navigation is visible
    await expect(page.getByText('PATRON')).toBeVisible();
    await expect(page.getByText('Dashboard')).toBeVisible();
    await expect(page.getByText('My Subscriptions')).toBeVisible();
    await expect(page.getByText('Discover Creators')).toBeVisible();
    await expect(page.getByText('Watch History')).toBeVisible();
    
    // Check search bar is present
    await expect(page.getByPlaceholder('Search creators, series, episodes...')).toBeVisible();
    
    // Check switch to creator view button
    await expect(page.getByText('Creator View')).toBeVisible();
  });

  test('should navigate to creator dashboard and show creator navigation', async ({ page }) => {
    // Navigate to creator dashboard
    await page.goto('http://localhost:3000/creator/dashboard');
    
    // Check that creator navigation is visible
    await expect(page.getByText('CREATOR')).toBeVisible();
    await expect(page.getByText('Dashboard')).toBeVisible();
    await expect(page.getByText('Analytics')).toBeVisible();
    await expect(page.getByText('Content Library')).toBeVisible();
    await expect(page.getByText('Patrons')).toBeVisible();
    await expect(page.getByText('Sync Status')).toBeVisible();
    
    // Check switch to patron view button
    await expect(page.getByText('Patron View')).toBeVisible();
  });

  test('should show breadcrumbs on patron subscriptions page', async ({ page }) => {
    // Navigate to patron subscriptions
    await page.goto('http://localhost:3000/patron/subscriptions');
    
    // Check breadcrumbs are visible
    await expect(page.getByText('Dashboard')).toBeVisible();
    await expect(page.getByText('My Subscriptions')).toBeVisible();
    
    // Check back button is present
    await expect(page.getByLabelText('Go back')).toBeVisible();
  });

  test('should handle mobile navigation on small screens', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Navigate to patron dashboard
    await page.goto('http://localhost:3000/dashboard');
    
    // Check mobile menu button is visible
    await expect(page.getByRole('button', { name: 'Open sidebar' })).toBeVisible();
    
    // Click mobile menu button
    await page.getByRole('button', { name: 'Open sidebar' }).click();
    
    // Check sidebar navigation is visible
    await expect(page.getByText('Dashboard')).toBeVisible();
    await expect(page.getByText('My Subscriptions')).toBeVisible();
  });

  test('should switch between patron and creator views', async ({ page }) => {
    // Start on patron dashboard
    await page.goto('http://localhost:3000/dashboard');
    await expect(page.getByText('PATRON')).toBeVisible();
    
    // Click switch to creator view
    await page.getByText('Creator View').click();
    
    // Should navigate to creator dashboard
    await expect(page).toHaveURL(/.*\/creator\/dashboard/);
    await expect(page.getByText('CREATOR')).toBeVisible();
    
    // Click switch to patron view
    await page.getByText('Patron View').click();
    
    // Should navigate back to patron dashboard
    await expect(page).toHaveURL(/.*\/dashboard/);
    await expect(page.getByText('PATRON')).toBeVisible();
  });

  test('should handle back navigation correctly', async ({ page }) => {
    // Navigate to patron subscriptions
    await page.goto('http://localhost:3000/patron/subscriptions');
    
    // Click back button
    await page.getByLabelText('Go back').click();
    
    // Should navigate to dashboard
    await expect(page).toHaveURL(/.*\/dashboard/);
  });

  test('should show mobile bottom navigation on patron pages', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Navigate to patron dashboard
    await page.goto('http://localhost:3000/dashboard');
    
    // Check bottom navigation is visible
    await expect(page.getByText('Home')).toBeVisible();
    await expect(page.getByText('Browse')).toBeVisible();
    await expect(page.getByText('Subscriptions')).toBeVisible();
    await expect(page.getByText('History')).toBeVisible();
    await expect(page.getByText('Profile')).toBeVisible();
  });

  test('should not show mobile bottom navigation on non-patron pages', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Navigate to home page
    await page.goto('http://localhost:3000');
    
    // Bottom navigation should not be visible
    await expect(page.locator('nav').filter({ hasText: 'Home Browse Subscriptions' })).not.toBeVisible();
  });
});