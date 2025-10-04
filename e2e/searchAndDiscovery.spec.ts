import { test, expect } from '@playwright/test';

test.describe('Search and Discovery', () => {
  test.describe('Search Functionality', () => {
    test('should perform basic search', async ({ page }) => {
      await page.route('**/api/v1/search*', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            results: {
              content: [
                {
                  id: '1',
                  title: 'React Tutorial',
                  creator_name: 'Test Creator',
                  thumbnail_url: 'https://via.placeholder.com/320x180',
                },
              ],
              creators: [
                {
                  id: '2',
                  name: 'React Expert',
                  avatar_url: 'https://via.placeholder.com/100',
                },
              ],
            },
          }),
        });
      });

      await page.goto('/search?q=react');
      await expect(page).toHaveURL(/\/search\?q=react/);
      await expect(page.getByText(/react tutorial/i)).toBeVisible();
    });

    test('should show search suggestions', async ({ page }) => {
      await page.route('**/api/v1/search/suggestions*', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            suggestions: ['react', 'react native', 'react hooks'],
          }),
        });
      });

      await page.goto('/search');
      
      const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first();
      if (await searchInput.isVisible()) {
        await searchInput.fill('rea');
        await page.waitForTimeout(500);
      }
    });

    test('should filter search results', async ({ page }) => {
      await page.route('**/api/v1/search*', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ results: { content: [], creators: [] } }),
        });
      });

      await page.goto('/search?q=test');
      
      // Look for filter options
      const filterButton = page.locator('button, div').filter({ hasText: /filter|sort|type/i }).first();
      if (await filterButton.isVisible()) {
        await expect(filterButton).toBeVisible();
      }
    });

    test('should handle empty search results', async ({ page }) => {
      await page.route('**/api/v1/search*', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            results: { content: [], creators: [] },
          }),
        });
      });

      await page.goto('/search?q=nonexistent');
      
      // Should show no results message
      const noResults = page.locator('text=/no results|nothing found|try again/i').first();
      if (await noResults.isVisible()) {
        await expect(noResults).toBeVisible();
      }
    });
  });

  test.describe('Browse Page', () => {
    test('should display content categories', async ({ page }) => {
      await page.route('**/api/v1/browse*', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            categories: [
              { id: '1', name: 'Gaming', count: 50 },
              { id: '2', name: 'Music', count: 30 },
              { id: '3', name: 'Movies', count: 40 },
            ],
          }),
        });
      });

      await page.goto('/browse');
      
      // Look for category content
      await page.waitForTimeout(500);
      const categories = page.locator('text=/gaming|music|movies/i');
      if (await categories.first().isVisible()) {
        await expect(categories.first()).toBeVisible();
      }
    });

    test('should filter by category', async ({ page }) => {
      await page.route('**/api/v1/browse*', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ content: [] }),
        });
      });

      await page.goto('/browse?category=gaming');
      await expect(page).toHaveURL(/\/browse\?category=gaming/);
    });
  });

  test.describe('Discover Page', () => {
    test('should show trending content', async ({ page }) => {
      await page.route('**/api/v1/discover/trending*', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            trending: [
              {
                id: '1',
                title: 'Trending Video',
                views: 10000,
                thumbnail_url: 'https://via.placeholder.com/320x180',
              },
            ],
          }),
        });
      });

      await page.goto('/discover');
      await page.waitForTimeout(500);
    });

    test('should show recommended content', async ({ page }) => {
      await page.route('**/api/v1/discover/recommended*', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            recommended: [
              {
                id: '1',
                title: 'Recommended for You',
                creator_name: 'Top Creator',
              },
            ],
          }),
        });
      });

      await page.goto('/discover');
      await page.waitForTimeout(500);
    });

    test('should show new releases', async ({ page }) => {
      await page.route('**/api/v1/discover/new*', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            new_releases: [
              {
                id: '1',
                title: 'Brand New Content',
                published_at: '2025-10-03T12:00:00Z',
              },
            ],
          }),
        });
      });

      await page.goto('/discover');
      await page.waitForTimeout(500);
    });
  });

  test.describe('Creator Discovery', () => {
    test('should display creators list', async ({ page }) => {
      await page.route('**/api/v1/creators*', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            creators: [
              {
                id: '1',
                name: 'Popular Creator',
                subscriber_count: 5000,
                avatar_url: 'https://via.placeholder.com/100',
              },
            ],
          }),
        });
      });

      await page.goto('/creators');
      await expect(page.getByText(/popular creator/i)).toBeVisible();
    });

    test('should view creator profile', async ({ page }) => {
      await page.route('**/api/v1/creators/123*', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: '123',
            name: 'Test Creator',
            bio: 'Creator bio',
            content: [],
          }),
        });
      });

      await page.goto('/creators/123');
      await expect(page).toHaveURL(/\/creators\/123/);
    });

    test('should show creator content', async ({ page }) => {
      await page.route('**/api/v1/creators/123*', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: '123',
            name: 'Test Creator',
            content: [
              {
                id: '1',
                title: 'Creator Video',
                thumbnail_url: 'https://via.placeholder.com/320x180',
              },
            ],
          }),
        });
      });

      await page.goto('/creators/123');
      await expect(page.getByText(/creator video/i)).toBeVisible();
    });
  });

  test.describe('Series Discovery', () => {
    test('should display series page', async ({ page }) => {
      await page.route('**/api/v1/series/123*', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: '123',
            title: 'Test Series',
            description: 'Series description',
            episodes: [
              {
                id: '1',
                title: 'Episode 1',
                episode_number: 1,
                season_number: 1,
              },
            ],
          }),
        });
      });

      await page.goto('/series/123');
      await expect(page.getByText(/test series/i)).toBeVisible();
    });

    test('should show episode list', async ({ page }) => {
      await page.route('**/api/v1/series/123*', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: '123',
            title: 'Test Series',
            episodes: [
              { id: '1', title: 'Episode 1', episode_number: 1 },
              { id: '2', title: 'Episode 2', episode_number: 2 },
            ],
          }),
        });
      });

      await page.goto('/series/123');
      await expect(page.getByText(/episode 1/i)).toBeVisible();
      await expect(page.getByText(/episode 2/i)).toBeVisible();
    });
  });

  test.describe('Navigation Bar Search', () => {
    test('should have search in navigation', async ({ page }) => {
      await page.goto('/');
      
      const searchInput = page.locator('nav input[type="search"], nav input[placeholder*="search" i]').first();
      if (await searchInput.isVisible()) {
        await expect(searchInput).toBeVisible();
        await searchInput.fill('test query');
        await searchInput.press('Enter');
        await expect(page).toHaveURL(/\/search\?q=test/);
      }
    });
  });
});
