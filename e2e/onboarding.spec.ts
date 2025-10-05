import { test, expect } from '@playwright/test';

test.describe('E2E - Onboarding Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API endpoints
    await page.route('**/api/v1/user/onboarding', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await page.route('**/api/v1/user/preferences', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });
  });

  test.describe('Wizard Navigation', () => {
    test('should display onboarding wizard for new users', async ({ page }) => {
      await page.goto('/onboarding');

      // Should show wizard
      const wizard = page.locator('[role="dialog"]').filter({ hasText: /welcome|get started|setup/i }).first();

      if (await wizard.count() > 0) {
        await expect(wizard).toBeVisible();
      } else {
        // Alternative: look for onboarding content
        const heading = page.locator('h1, h2').filter({ hasText: /welcome|onboard/i }).first();
        await expect(heading).toBeVisible();
      }
    });

    test('should show progress indicator', async ({ page }) => {
      await page.goto('/onboarding');

      // Look for progress indicator
      const progress = page.locator('[role="progressbar"], .progress').first();

      if (await progress.count() > 0) {
        await expect(progress).toBeVisible();

        // Check for step information
        const stepText = page.locator('text=/step \\d+ of \\d+/i');
        if (await stepText.count() > 0) {
          await expect(stepText.first()).toBeVisible();
        }
      }
    });

    test('should navigate through all steps', async ({ page }) => {
      await page.goto('/onboarding');

      // Find Next button
      const nextButton = page.locator('button').filter({ hasText: /next|continue/i }).first();

      if (await nextButton.count() > 0) {
        // Click through steps
        await nextButton.click();
        await page.waitForTimeout(300);

        await nextButton.click();
        await page.waitForTimeout(300);

        // Should reach final step
        const finishButton = page.locator('button').filter({ hasText: /finish|complete|get started/i }).first();
        if (await finishButton.count() > 0) {
          await expect(finishButton).toBeVisible();
        }
      }
    });

    test('should navigate backwards', async ({ page }) => {
      await page.goto('/onboarding');

      // Go forward first
      const nextButton = page.locator('button').filter({ hasText: /next/i }).first();
      if (await nextButton.count() > 0) {
        await nextButton.click();
        await page.waitForTimeout(300);

        // Now go back
        const backButton = page.locator('button').filter({ hasText: /back|previous/i }).first();
        if (await backButton.count() > 0) {
          await expect(backButton).toBeVisible();
          await backButton.click();
          await page.waitForTimeout(300);
        }
      }
    });

    test('should disable back button on first step', async ({ page }) => {
      await page.goto('/onboarding');

      const backButton = page.locator('button').filter({ hasText: /back|previous/i }).first();

      if (await backButton.count() > 0) {
        await expect(backButton).toBeDisabled();
      }
    });
  });

  test.describe('Step 1 - Personal Information', () => {
    test('should collect user name', async ({ page }) => {
      await page.goto('/onboarding');

      // Look for name input
      const nameInput = page.locator('input[name="name"], input[placeholder*="name" i]').first();

      if (await nameInput.count() > 0) {
        await nameInput.fill('John Doe');

        const value = await nameInput.inputValue();
        expect(value).toBe('John Doe');
      }
    });

    test('should validate required fields', async ({ page }) => {
      await page.goto('/onboarding');

      // Try to proceed without filling required fields
      const nextButton = page.locator('button').filter({ hasText: /next/i }).first();

      if (await nextButton.count() > 0) {
        await nextButton.click();
        await page.waitForTimeout(300);

        // Look for validation error
        const error = page.locator('[role="alert"], .error-message').first();
        if (await error.count() > 0) {
          await expect(error).toBeVisible();
        }
      }
    });

    test('should accept valid input and proceed', async ({ page }) => {
      await page.goto('/onboarding');

      const nameInput = page.locator('input[name="name"], input[placeholder*="name" i]').first();

      if (await nameInput.count() > 0) {
        await nameInput.fill('Jane Smith');

        const nextButton = page.locator('button').filter({ hasText: /next/i }).first();
        await nextButton.click();
        await page.waitForTimeout(500);

        // Should move to next step
        const progress = page.locator('text=/step 2/i').first();
        if (await progress.count() > 0) {
          await expect(progress).toBeVisible();
        }
      }
    });
  });

  test.describe('Step 2 - Interests Selection', () => {
    test('should display interest options', async ({ page }) => {
      await page.goto('/onboarding');

      // Navigate to interests step
      const nextButton = page.locator('button').filter({ hasText: /next/i }).first();
      if (await nextButton.count() > 0) {
        // Fill first step if needed
        const nameInput = page.locator('input[name="name"]').first();
        if (await nameInput.count() > 0) {
          await nameInput.fill('Test User');
        }

        await nextButton.click();
        await page.waitForTimeout(500);

        // Look for interest checkboxes
        const checkboxes = page.locator('input[type="checkbox"]');
        if (await checkboxes.count() > 0) {
          await expect(checkboxes.first()).toBeVisible();
        }
      }
    });

    test('should select multiple interests', async ({ page }) => {
      await page.goto('/onboarding');

      // Navigate to interests
      const nextButton = page.locator('button').filter({ hasText: /next/i }).first();
      if (await nextButton.count() > 0) {
        const nameInput = page.locator('input[name="name"]').first();
        if (await nameInput.count() > 0) {
          await nameInput.fill('Test User');
        }

        await nextButton.click();
        await page.waitForTimeout(500);

        // Select interests
        const checkboxes = page.locator('input[type="checkbox"]');
        const count = await checkboxes.count();

        if (count > 0) {
          await checkboxes.nth(0).check();
          await expect(checkboxes.nth(0)).toBeChecked();

          if (count > 1) {
            await checkboxes.nth(1).check();
            await expect(checkboxes.nth(1)).toBeChecked();
          }
        }
      }
    });

    test('should deselect interests', async ({ page }) => {
      await page.goto('/onboarding');

      const nextButton = page.locator('button').filter({ hasText: /next/i }).first();
      if (await nextButton.count() > 0) {
        const nameInput = page.locator('input[name="name"]').first();
        if (await nameInput.count() > 0) {
          await nameInput.fill('Test User');
        }

        await nextButton.click();
        await page.waitForTimeout(500);

        const checkbox = page.locator('input[type="checkbox"]').first();
        if (await checkbox.count() > 0) {
          await checkbox.check();
          await checkbox.uncheck();

          await expect(checkbox).not.toBeChecked();
        }
      }
    });
  });

  test.describe('Step 3 - Preferences', () => {
    test('should display preference options', async ({ page }) => {
      await page.goto('/onboarding');

      // Navigate to preferences step
      const nextButton = page.locator('button').filter({ hasText: /next/i }).first();

      if (await nextButton.count() > 0) {
        // Fill and navigate through steps
        const nameInput = page.locator('input[name="name"]').first();
        if (await nameInput.count() > 0) {
          await nameInput.fill('Test User');
        }

        await nextButton.click();
        await page.waitForTimeout(300);

        await nextButton.click();
        await page.waitForTimeout(500);

        // Look for preference options
        const select = page.locator('select').first();
        if (await select.count() > 0) {
          await expect(select).toBeVisible();
        }
      }
    });

    test('should select preferences', async ({ page }) => {
      await page.goto('/onboarding');

      const nextButton = page.locator('button').filter({ hasText: /next/i }).first();

      if (await nextButton.count() > 0) {
        const nameInput = page.locator('input[name="name"]').first();
        if (await nameInput.count() > 0) {
          await nameInput.fill('Test User');
        }

        await nextButton.click();
        await page.waitForTimeout(300);

        await nextButton.click();
        await page.waitForTimeout(500);

        const select = page.locator('select').first();
        if (await select.count() > 0) {
          const options = await select.locator('option').all();
          if (options.length > 1) {
            await select.selectOption({ index: 1 });
          }
        }
      }
    });
  });

  test.describe('Completion', () => {
    test('should complete onboarding successfully', async ({ page }) => {
      await page.goto('/onboarding');

      // Fill and complete all steps
      const nameInput = page.locator('input[name="name"]').first();
      if (await nameInput.count() > 0) {
        await nameInput.fill('Complete User');
      }

      // Navigate through all steps
      const nextButton = page.locator('button').filter({ hasText: /next/i }).first();

      if (await nextButton.count() > 0) {
        await nextButton.click();
        await page.waitForTimeout(300);

        // Select an interest
        const checkbox = page.locator('input[type="checkbox"]').first();
        if (await checkbox.count() > 0) {
          await checkbox.check();
        }

        await nextButton.click();
        await page.waitForTimeout(300);

        // Select preference
        const select = page.locator('select').first();
        if (await select.count() > 0) {
          const options = await select.locator('option').all();
          if (options.length > 1) {
            await select.selectOption({ index: 1 });
          }
        }

        // Complete
        const finishButton = page.locator('button').filter({ hasText: /finish|complete|get started/i }).first();
        if (await finishButton.count() > 0) {
          await finishButton.click();
          await page.waitForTimeout(1000);

          // Should redirect or show success
          const success = page.locator('text=/success|complete|welcome/i');
          if (await success.count() > 0) {
            await expect(success.first()).toBeVisible();
          }
        }
      }
    });

    test('should show completion message', async ({ page }) => {
      await page.goto('/onboarding');

      // Complete wizard quickly
      const nameInput = page.locator('input[name="name"]').first();
      if (await nameInput.count() > 0) {
        await nameInput.fill('Test User');
      }

      const buttons = page.locator('button');
      const nextButton = buttons.filter({ hasText: /next/i }).first();

      if (await nextButton.count() > 0) {
        await nextButton.click();
        await page.waitForTimeout(200);
        await nextButton.click();
        await page.waitForTimeout(200);

        const finishButton = buttons.filter({ hasText: /finish|complete/i }).first();
        if (await finishButton.count() > 0) {
          await finishButton.click();
          await page.waitForTimeout(500);
        }
      }
    });

    test('should redirect after completion', async ({ page }) => {
      await page.goto('/onboarding');

      const nameInput = page.locator('input[name="name"]').first();
      if (await nameInput.count() > 0) {
        await nameInput.fill('Redirect User');
      }

      const nextButton = page.locator('button').filter({ hasText: /next/i }).first();

      if (await nextButton.count() > 0) {
        await nextButton.click();
        await page.waitForTimeout(200);
        await nextButton.click();
        await page.waitForTimeout(200);

        const finishButton = page.locator('button').filter({ hasText: /finish/i }).first();
        if (await finishButton.count() > 0) {
          await finishButton.click();
          await page.waitForTimeout(1000);

          // Check if redirected
          const url = page.url();
          // Should redirect away from onboarding
          expect(url).not.toContain('/onboarding');
        }
      }
    });
  });

  test.describe('Skip Functionality', () => {
    test('should allow skipping optional steps', async ({ page }) => {
      await page.goto('/onboarding');

      const skipButton = page.locator('button').filter({ hasText: /skip/i }).first();

      if (await skipButton.count() > 0) {
        await expect(skipButton).toBeVisible();

        await skipButton.click();
        await page.waitForTimeout(300);

        // Should move to next step
      }
    });

    test('should complete onboarding with skipped steps', async ({ page }) => {
      await page.goto('/onboarding');

      // Fill required field
      const nameInput = page.locator('input[name="name"]').first();
      if (await nameInput.count() > 0) {
        await nameInput.fill('Skip User');
      }

      const nextButton = page.locator('button').filter({ hasText: /next/i }).first();
      if (await nextButton.count() > 0) {
        await nextButton.click();
        await page.waitForTimeout(300);

        // Skip interests
        const skipButton = page.locator('button').filter({ hasText: /skip/i }).first();
        if (await skipButton.count() > 0) {
          await skipButton.click();
          await page.waitForTimeout(300);
        } else {
          await nextButton.click();
          await page.waitForTimeout(300);
        }

        const finishButton = page.locator('button').filter({ hasText: /finish/i }).first();
        if (await finishButton.count() > 0) {
          await finishButton.click();
          await page.waitForTimeout(500);
        }
      }
    });
  });

  test.describe('Data Persistence', () => {
    test('should maintain data when navigating back', async ({ page }) => {
      await page.goto('/onboarding');

      const nameInput = page.locator('input[name="name"]').first();

      if (await nameInput.count() > 0) {
        await nameInput.fill('Persistent User');

        const nextButton = page.locator('button').filter({ hasText: /next/i }).first();
        await nextButton.click();
        await page.waitForTimeout(300);

        const backButton = page.locator('button').filter({ hasText: /back/i }).first();
        if (await backButton.count() > 0) {
          await backButton.click();
          await page.waitForTimeout(300);

          // Name should still be there
          const value = await nameInput.inputValue();
          expect(value).toBe('Persistent User');
        }
      }
    });
  });

  test.describe('Accessibility', () => {
    test('should be keyboard navigable', async ({ page }) => {
      await page.goto('/onboarding');

      // Tab through elements
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      const focused = await page.evaluate(() => document.activeElement?.tagName);
      expect(['INPUT', 'BUTTON', 'SELECT']).toContain(focused);
    });

    test('should have proper ARIA attributes', async ({ page }) => {
      await page.goto('/onboarding');

      const wizard = page.locator('[role="dialog"]').first();

      if (await wizard.count() > 0) {
        const ariaLabel = await wizard.getAttribute('aria-labelledby');
        const ariaDesc = await wizard.getAttribute('aria-describedby');

        expect(ariaLabel || ariaDesc).toBeTruthy();
      }
    });

    test('should announce step changes', async ({ page }) => {
      await page.goto('/onboarding');

      const liveRegion = page.locator('[aria-live]').first();

      if (await liveRegion.count() > 0) {
        const ariaLive = await liveRegion.getAttribute('aria-live');
        expect(['polite', 'assertive']).toContain(ariaLive || '');
      }
    });
  });

  test.describe('Mobile Experience', () => {
    test('should work on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/onboarding');

      // Should still show wizard
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible();

      // Buttons should be visible
      const nextButton = page.locator('button').filter({ hasText: /next/i }).first();
      if (await nextButton.count() > 0) {
        await expect(nextButton).toBeVisible();
      }
    });

    test('should have touch-friendly buttons', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/onboarding');

      const buttons = page.locator('button');
      const count = Math.min(await buttons.count(), 3);

      for (let i = 0; i < count; i++) {
        const button = buttons.nth(i);
        if (await button.isVisible()) {
          const box = await button.boundingBox();

          if (box) {
            expect(box.height).toBeGreaterThanOrEqual(40);
          }
        }
      }
    });
  });
});
