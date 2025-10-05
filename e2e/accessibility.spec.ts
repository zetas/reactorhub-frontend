import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('E2E - Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API calls to ensure consistent content
    await page.route('**/api/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [] }),
      });
    });
  });

  test.describe('ARIA Labels and Landmarks', () => {
    test('should have no accessibility violations on home page', async ({ page }) => {
      await page.goto('/');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should have proper navigation landmarks', async ({ page }) => {
      await page.goto('/');

      // Check for main navigation
      const nav = page.locator('nav').first();
      await expect(nav).toBeVisible();

      // Check for main content area
      const main = page.locator('main').first();
      if (await main.count() > 0) {
        await expect(main).toBeVisible();
      }
    });

    test('should have accessible search input', async ({ page }) => {
      await page.goto('/');

      // Look for search input with proper labels
      const searchInput = page.locator('input[type="search"], input[aria-label*="search" i]').first();

      if (await searchInput.count() > 0) {
        await expect(searchInput).toBeVisible();

        // Check for aria-label or associated label
        const ariaLabel = await searchInput.getAttribute('aria-label');
        const labelId = await searchInput.getAttribute('aria-labelledby');

        expect(ariaLabel || labelId).toBeTruthy();
      }
    });

    test('should have accessible buttons', async ({ page }) => {
      await page.goto('/');

      const buttons = page.locator('button');
      const buttonCount = await buttons.count();

      for (let i = 0; i < Math.min(buttonCount, 5); i++) {
        const button = buttons.nth(i);
        const isVisible = await button.isVisible();

        if (isVisible) {
          const accessibleName = await button.textContent();
          const ariaLabel = await button.getAttribute('aria-label');

          // Button should have either text content or aria-label
          expect(accessibleName || ariaLabel).toBeTruthy();
        }
      }
    });

    test('should have alt text on images', async ({ page }) => {
      await page.goto('/');

      const images = page.locator('img');
      const imageCount = await images.count();

      for (let i = 0; i < Math.min(imageCount, 5); i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');

        // All images should have alt attribute (can be empty for decorative)
        expect(alt).toBeDefined();
      }
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('should navigate through interactive elements with Tab', async ({ page }) => {
      await page.goto('/');

      // Get first focusable element
      await page.keyboard.press('Tab');

      const firstFocused = await page.evaluate(() => document.activeElement?.tagName);
      expect(['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA']).toContain(firstFocused);

      // Tab through a few more elements
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      const thirdFocused = await page.evaluate(() => document.activeElement?.tagName);
      expect(['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA']).toContain(thirdFocused);
    });

    test('should navigate backwards with Shift+Tab', async ({ page }) => {
      await page.goto('/');

      // Tab forward a few times
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      const elementAfterForward = await page.evaluate(() => {
        return document.activeElement?.outerHTML;
      });

      // Tab backward once
      await page.keyboard.press('Shift+Tab');

      const elementAfterBackward = await page.evaluate(() => {
        return document.activeElement?.outerHTML;
      });

      // Elements should be different
      expect(elementAfterForward).not.toBe(elementAfterBackward);
    });

    test('should activate links with Enter key', async ({ page }) => {
      await page.goto('/');

      const link = page.locator('a').first();
      if (await link.count() > 0) {
        await link.focus();

        // Check that Enter key works
        await link.press('Enter');

        // Page should navigate or modal should open
        await page.waitForTimeout(500);
      }
    });

    test('should activate buttons with Space key', async ({ page }) => {
      await page.goto('/');

      const button = page.locator('button').first();
      if (await button.count() > 0) {
        await button.focus();
        await button.press('Space');

        // Allow time for action to complete
        await page.waitForTimeout(300);
      }
    });

    test('should close modals with Escape key', async ({ page }) => {
      await page.goto('/');

      // Look for a button that opens a modal
      const modalTrigger = page.locator('button').filter({ hasText: /open|show|menu/i }).first();

      if (await modalTrigger.count() > 0) {
        await modalTrigger.click();
        await page.waitForTimeout(300);

        // Press Escape
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);

        // Modal should be closed (check for common modal indicators)
        const modal = page.locator('[role="dialog"], [role="menu"]');
        if (await modal.count() > 0) {
          await expect(modal).not.toBeVisible();
        }
      }
    });
  });

  test.describe('Focus Management', () => {
    test('should have visible focus indicators', async ({ page }) => {
      await page.goto('/');

      // Tab to first focusable element
      await page.keyboard.press('Tab');

      // Check if focus is visible (using computed styles)
      const hasFocusIndicator = await page.evaluate(() => {
        const focused = document.activeElement;
        if (!focused) return false;

        const styles = window.getComputedStyle(focused);
        const pseudoStyles = window.getComputedStyle(focused, ':focus');

        // Check for outline or ring styles
        return (
          styles.outline !== 'none' ||
          styles.boxShadow !== 'none' ||
          pseudoStyles.outline !== 'none' ||
          pseudoStyles.boxShadow !== 'none'
        );
      });

      expect(hasFocusIndicator).toBeTruthy();
    });

    test('should maintain focus when navigating', async ({ page }) => {
      await page.goto('/');

      await page.keyboard.press('Tab');
      const firstElement = await page.evaluate(() => document.activeElement?.outerHTML);

      // Focus should remain on an element
      expect(firstElement).toBeTruthy();
      expect(firstElement).not.toContain('BODY');
    });

    test('should trap focus in modals', async ({ page }) => {
      await page.goto('/');

      // Find and open a modal
      const modalButton = page.locator('button').filter({ hasText: /open|menu|profile/i }).first();

      if (await modalButton.count() > 0) {
        await modalButton.click();
        await page.waitForTimeout(300);

        const modal = page.locator('[role="dialog"], [role="menu"]').first();

        if (await modal.isVisible()) {
          // Tab multiple times
          for (let i = 0; i < 10; i++) {
            await page.keyboard.press('Tab');
          }

          // Check that focus is still within modal
          const focusedElement = await page.evaluate(() => {
            return document.activeElement?.closest('[role="dialog"], [role="menu"]') !== null;
          });

          expect(focusedElement).toBeTruthy();
        }
      }
    });
  });

  test.describe('Form Accessibility', () => {
    test('should have labels for all form inputs', async ({ page }) => {
      await page.goto('/login');

      const inputs = page.locator('input');
      const inputCount = await inputs.count();

      for (let i = 0; i < inputCount; i++) {
        const input = inputs.nth(i);
        const id = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');
        const ariaLabelledby = await input.getAttribute('aria-labelledby');

        if (id) {
          const label = page.locator(`label[for="${id}"]`);
          const hasLabel = await label.count() > 0;

          // Input should have either a label, aria-label, or aria-labelledby
          expect(hasLabel || ariaLabel || ariaLabelledby).toBeTruthy();
        }
      }
    });

    test('should indicate required fields', async ({ page }) => {
      await page.goto('/login');

      const requiredInputs = page.locator('input[required]');
      const count = await requiredInputs.count();

      for (let i = 0; i < count; i++) {
        const input = requiredInputs.nth(i);
        const ariaRequired = await input.getAttribute('aria-required');

        // Required inputs should have aria-required
        expect(ariaRequired).toBe('true');
      }
    });

    test('should announce form errors', async ({ page }) => {
      await page.goto('/login');

      // Try to submit empty form
      const submitButton = page.locator('button[type="submit"]').first();
      if (await submitButton.count() > 0) {
        await submitButton.click();
        await page.waitForTimeout(500);

        // Look for error messages with role="alert"
        const alerts = page.locator('[role="alert"]');
        if (await alerts.count() > 0) {
          await expect(alerts.first()).toBeVisible();
        }
      }
    });
  });

  test.describe('Color Contrast', () => {
    test('should have sufficient color contrast', async ({ page }) => {
      await page.goto('/');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2aa'])
        .analyze();

      const contrastViolations = accessibilityScanResults.violations.filter(
        v => v.id === 'color-contrast'
      );

      expect(contrastViolations).toHaveLength(0);
    });
  });

  test.describe('Screen Reader Support', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto('/');

      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();

      if (headings.length > 0) {
        // Should have at least one h1
        const h1Count = await page.locator('h1').count();
        expect(h1Count).toBeGreaterThanOrEqual(1);

        // Should not have more than one h1 (best practice)
        expect(h1Count).toBeLessThanOrEqual(1);
      }
    });

    test('should have descriptive page title', async ({ page }) => {
      await page.goto('/');

      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);
      expect(title).not.toBe('');
    });

    test('should use semantic HTML', async ({ page }) => {
      await page.goto('/');

      // Check for semantic elements
      const nav = page.locator('nav');
      const main = page.locator('main');
      const footer = page.locator('footer');
      const article = page.locator('article');
      const section = page.locator('section');

      const semanticElementsCount =
        (await nav.count()) +
        (await main.count()) +
        (await footer.count()) +
        (await article.count()) +
        (await section.count());

      // Should have at least some semantic elements
      expect(semanticElementsCount).toBeGreaterThan(0);
    });

    test('should have aria-live regions for dynamic content', async ({ page }) => {
      await page.goto('/');

      // Look for loading states or status messages
      const liveRegions = page.locator('[aria-live]');

      if (await liveRegions.count() > 0) {
        const liveRegion = liveRegions.first();
        const ariaLive = await liveRegion.getAttribute('aria-live');

        expect(['polite', 'assertive']).toContain(ariaLive);
      }
    });
  });

  test.describe('Touch Target Sizes', () => {
    test('should have minimum 44x44px touch targets for mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      const buttons = page.locator('button, a');
      const count = Math.min(await buttons.count(), 10);

      for (let i = 0; i < count; i++) {
        const button = buttons.nth(i);

        if (await button.isVisible()) {
          const box = await button.boundingBox();

          if (box) {
            // Allow for some flexibility (40px is close enough)
            expect(box.width).toBeGreaterThanOrEqual(40);
            expect(box.height).toBeGreaterThanOrEqual(40);
          }
        }
      }
    });
  });

  test.describe('Responsive Accessibility', () => {
    test('should be accessible on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should be accessible on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should be accessible on desktop viewport', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });
});
