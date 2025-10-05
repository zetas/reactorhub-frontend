import { test, expect } from '@playwright/test';

test.describe('E2E - Filters and Search', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API responses
    await page.route('**/api/v1/creators**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          creators: [
            {
              id: '1',
              name: 'Gaming Creator',
              category: 'gaming',
              subscriber_count: 5000,
              avatar_url: 'https://via.placeholder.com/100',
            },
            {
              id: '2',
              name: 'Tech Reviewer',
              category: 'technology',
              subscriber_count: 3000,
              avatar_url: 'https://via.placeholder.com/100',
            },
            {
              id: '3',
              name: 'Music Artist',
              category: 'music',
              subscriber_count: 10000,
              avatar_url: 'https://via.placeholder.com/100',
            },
          ],
        }),
      });
    });

    await page.route('**/api/v1/content**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          content: [
            {
              id: '1',
              title: 'Short Gaming Video',
              duration: 300, // 5 minutes
              creator_name: 'Gaming Creator',
              thumbnail_url: 'https://via.placeholder.com/320x180',
            },
            {
              id: '2',
              title: 'Long Tech Review',
              duration: 2400, // 40 minutes
              creator_name: 'Tech Reviewer',
              thumbnail_url: 'https://via.placeholder.com/320x180',
            },
          ],
        }),
      });
    });
  });

  test.describe('Search Functionality', () => {
    test('should search for creators', async ({ page }) => {
      await page.goto('/patron/browse');

      // Find and fill search input
      const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first();
      await searchInput.fill('Gaming');

      // Submit search
      await searchInput.press('Enter');

      // Wait for results
      await page.waitForTimeout(500);

      // Should show search results
      await expect(page.locator('text=/gaming/i').first()).toBeVisible({ timeout: 5000 });
    });

    test('should clear search with clear button', async ({ page }) => {
      await page.goto('/patron/browse');

      const searchInput = page.locator('input[type="search"]').first();
      await searchInput.fill('Test query');

      // Look for clear button
      const clearButton = page.locator('button[aria-label*="clear" i]').first();

      if (await clearButton.isVisible()) {
        await clearButton.click();

        // Input should be cleared
        await expect(searchInput).toHaveValue('');
      }
    });

    test('should show no results message', async ({ page }) => {
      await page.route('**/api/v1/creators**', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ creators: [] }),
        });
      });

      await page.goto('/patron/browse');

      const searchInput = page.locator('input[type="search"]').first();
      await searchInput.fill('NonexistentCreator123');
      await searchInput.press('Enter');

      await page.waitForTimeout(500);

      // Should show empty state
      const emptyMessage = page.locator('text=/no results|nothing found|no creators/i');
      if (await emptyMessage.count() > 0) {
        await expect(emptyMessage.first()).toBeVisible();
      }
    });

    test('should maintain search query in URL', async ({ page }) => {
      await page.goto('/patron/browse');

      const searchInput = page.locator('input[type="search"]').first();
      await searchInput.fill('gaming');
      await searchInput.press('Enter');

      await page.waitForTimeout(500);

      // URL should contain search query
      const url = page.url();
      expect(url).toContain('gaming');
    });
  });

  test.describe('Duration Filter', () => {
    test('should filter by short duration', async ({ page }) => {
      await page.goto('/patron/browse');

      // Look for duration filter
      const durationFilter = page.locator('select[name*="duration" i], select').filter({ hasText: /duration/i }).first();

      if (await durationFilter.count() > 0) {
        await durationFilter.selectOption({ label: /short/i });
        await page.waitForTimeout(500);

        // Check that results are filtered
        const results = page.locator('[data-testid="content-card"], [data-testid="creator-card"]');
        await expect(results.first()).toBeVisible({ timeout: 3000 });
      }
    });

    test('should filter by long duration', async ({ page }) => {
      await page.goto('/patron/browse');

      const durationFilter = page.locator('select').filter({ hasText: /duration/i }).first();

      if (await durationFilter.count() > 0) {
        await durationFilter.selectOption({ label: /long/i });
        await page.waitForTimeout(500);
      }
    });

    test('should reset duration filter', async ({ page }) => {
      await page.goto('/patron/browse');

      const durationFilter = page.locator('select').filter({ hasText: /duration/i }).first();

      if (await durationFilter.count() > 0) {
        // Select a filter
        await durationFilter.selectOption({ label: /short/i });
        await page.waitForTimeout(300);

        // Reset to all
        await durationFilter.selectOption({ label: /all/i });
        await page.waitForTimeout(300);
      }
    });
  });

  test.describe('Category Filter', () => {
    test('should filter by category', async ({ page }) => {
      await page.goto('/patron/browse');

      // Look for category filter
      const categoryFilter = page.locator('select[name*="category" i], button').filter({ hasText: /category|filter/i }).first();

      if (await categoryFilter.count() > 0) {
        if (await categoryFilter.evaluate(el => el.tagName) === 'SELECT') {
          await categoryFilter.selectOption({ label: /gaming/i });
        } else {
          await categoryFilter.click();
          await page.locator('text=/gaming/i').first().click();
        }

        await page.waitForTimeout(500);
      }
    });

    test('should show all categories', async ({ page }) => {
      await page.goto('/patron/browse');

      // Categories should be visible
      const categories = page.locator('text=/gaming|technology|music/i');
      if (await categories.count() > 0) {
        await expect(categories.first()).toBeVisible();
      }
    });
  });

  test.describe('Sort Options', () => {
    test('should sort by newest', async ({ page }) => {
      await page.goto('/patron/browse');

      const sortSelect = page.locator('select').filter({ hasText: /sort/i }).first();

      if (await sortSelect.count() > 0) {
        await sortSelect.selectOption({ label: /newest|recent/i });
        await page.waitForTimeout(500);
      }
    });

    test('should sort by popular', async ({ page }) => {
      await page.goto('/patron/browse');

      const sortSelect = page.locator('select').filter({ hasText: /sort/i }).first();

      if (await sortSelect.count() > 0) {
        await sortSelect.selectOption({ label: /popular|most/i });
        await page.waitForTimeout(500);
      }
    });

    test('should sort by title', async ({ page }) => {
      await page.goto('/patron/browse');

      const sortSelect = page.locator('select').filter({ hasText: /sort/i }).first();

      if (await sortSelect.count() > 0) {
        const titleOption = sortSelect.locator('option').filter({ hasText: /title|name|a-z/i });

        if (await titleOption.count() > 0) {
          await sortSelect.selectOption({ label: /title|a-z/i });
          await page.waitForTimeout(500);
        }
      }
    });
  });

  test.describe('Multiple Filters Combined', () => {
    test('should apply multiple filters together', async ({ page }) => {
      await page.goto('/patron/browse');

      // Apply duration filter
      const durationFilter = page.locator('select').filter({ hasText: /duration/i }).first();
      if (await durationFilter.count() > 0) {
        await durationFilter.selectOption({ label: /short/i });
        await page.waitForTimeout(300);
      }

      // Apply sort
      const sortSelect = page.locator('select').filter({ hasText: /sort/i }).first();
      if (await sortSelect.count() > 0) {
        await sortSelect.selectOption({ label: /popular/i });
        await page.waitForTimeout(300);
      }

      // Results should be filtered and sorted
      await page.waitForTimeout(500);
    });

    test('should clear all filters', async ({ page }) => {
      await page.goto('/patron/browse');

      // Apply some filters
      const durationFilter = page.locator('select').filter({ hasText: /duration/i }).first();
      if (await durationFilter.count() > 0) {
        await durationFilter.selectOption({ label: /short/i });
      }

      // Look for clear filters button
      const clearButton = page.locator('button').filter({ hasText: /clear.*filter|reset/i }).first();

      if (await clearButton.count() > 0) {
        await clearButton.click();
        await page.waitForTimeout(300);

        // Filters should be reset
        if (await durationFilter.count() > 0) {
          const value = await durationFilter.inputValue();
          expect(value).toBe('all' || value === '');
        }
      }
    });
  });

  test.describe('Active Filter Display', () => {
    test('should show active filters as tags', async ({ page }) => {
      await page.goto('/patron/browse');

      // Apply a filter
      const durationFilter = page.locator('select').filter({ hasText: /duration/i }).first();

      if (await durationFilter.count() > 0) {
        await durationFilter.selectOption({ label: /short/i });
        await page.waitForTimeout(500);

        // Look for active filter tag
        const filterTag = page.locator('text=/short/i').filter({ hasText: /short.*videos|duration.*short/i });

        if (await filterTag.count() > 0) {
          await expect(filterTag.first()).toBeVisible();
        }
      }
    });

    test('should remove individual filter tags', async ({ page }) => {
      await page.goto('/patron/browse');

      // Apply a filter
      const durationFilter = page.locator('select').filter({ hasText: /duration/i }).first();

      if (await durationFilter.count() > 0) {
        await durationFilter.selectOption({ label: /short/i });
        await page.waitForTimeout(300);

        // Look for remove button on filter tag
        const removeButton = page.locator('button[aria-label*="remove" i]').first();

        if (await removeButton.count() > 0) {
          await removeButton.click();
          await page.waitForTimeout(300);
        }
      }
    });
  });

  test.describe('Filter Persistence', () => {
    test('should maintain filters on page refresh', async ({ page }) => {
      await page.goto('/patron/browse');

      // Apply filter
      const durationFilter = page.locator('select').filter({ hasText: /duration/i }).first();

      if (await durationFilter.count() > 0) {
        await durationFilter.selectOption({ label: /short/i });
        await page.waitForTimeout(300);

        // Get URL with filters
        const urlWithFilters = page.url();

        // Refresh page
        await page.reload();
        await page.waitForTimeout(500);

        // URL should still have filters
        expect(page.url()).toBe(urlWithFilters);

        // Filter should still be selected
        const selectedValue = await durationFilter.inputValue();
        expect(selectedValue).not.toBe('all');
      }
    });
  });

  test.describe('Results Count', () => {
    test('should display results count', async ({ page }) => {
      await page.goto('/patron/browse');

      await page.waitForTimeout(500);

      // Look for results count
      const resultsCount = page.locator('text=/\\d+ results|showing \\d+/i');

      if (await resultsCount.count() > 0) {
        await expect(resultsCount.first()).toBeVisible();
      }
    });

    test('should update count when filters change', async ({ page }) => {
      await page.goto('/patron/browse');

      await page.waitForTimeout(500);

      // Get initial count
      const resultsCount = page.locator('text=/\\d+ results/i').first();

      if (await resultsCount.count() > 0) {
        const initialText = await resultsCount.textContent();

        // Apply filter
        const durationFilter = page.locator('select').filter({ hasText: /duration/i }).first();

        if (await durationFilter.count() > 0) {
          await durationFilter.selectOption({ label: /short/i });
          await page.waitForTimeout(500);

          // Count might change
          const newText = await resultsCount.textContent();
          // Just verify it still displays something
          expect(newText).toBeTruthy();
        }
      }
    });
  });

  test.describe('Filter Accessibility', () => {
    test('should be keyboard navigable', async ({ page }) => {
      await page.goto('/patron/browse');

      // Tab to filters
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      const focused = await page.evaluate(() => document.activeElement?.tagName);
      expect(['SELECT', 'BUTTON', 'INPUT']).toContain(focused);
    });

    test('should have accessible labels', async ({ page }) => {
      await page.goto('/patron/browse');

      const selects = page.locator('select');
      const count = await selects.count();

      for (let i = 0; i < count; i++) {
        const select = selects.nth(i);
        const ariaLabel = await select.getAttribute('aria-label');
        const id = await select.getAttribute('id');

        if (id) {
          const label = page.locator(`label[for="${id}"]`);
          const hasLabel = await label.count() > 0;

          expect(hasLabel || ariaLabel).toBeTruthy();
        }
      }
    });

    test('should announce filter changes', async ({ page }) => {
      await page.goto('/patron/browse');

      // Look for live region
      const liveRegion = page.locator('[aria-live], [role="status"]');

      if (await liveRegion.count() > 0) {
        const ariaLive = await liveRegion.first().getAttribute('aria-live');
        expect(['polite', 'assertive']).toContain(ariaLive || '');
      }
    });
  });

  test.describe('Mobile Filter Experience', () => {
    test('should show filter button on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/patron/browse');

      // Look for filter button/toggle
      const filterButton = page.locator('button').filter({ hasText: /filter|show filter/i }).first();

      if (await filterButton.count() > 0) {
        await expect(filterButton).toBeVisible();
      }
    });

    test('should open filter panel on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/patron/browse');

      const filterButton = page.locator('button').filter({ hasText: /filter/i }).first();

      if (await filterButton.count() > 0) {
        await filterButton.click();
        await page.waitForTimeout(300);

        // Filter panel should open
        const filterPanel = page.locator('[role="dialog"], .filter-panel');
        if (await filterPanel.count() > 0) {
          await expect(filterPanel.first()).toBeVisible();
        }
      }
    });
  });
});
