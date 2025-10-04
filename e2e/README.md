# E2E Test Suite - ReactorHub

Comprehensive end-to-end tests for all React pages and components using Playwright.

## Test Coverage

### 1. Authentication Flow (`auth.spec.ts`)
- Login page functionality
- Signup page functionality
- OAuth callback handling
- Protected route redirects
- Patreon OAuth integration

**Tests:** 7

### 2. Public Pages (`publicPages.spec.ts`)
- Home page
- About, Features, Pricing pages
- Creators listing
- Discover & Browse pages
- Contact, Blog, Careers pages
- Legal pages (Privacy, Terms)
- Navigation between pages
- Responsive design (mobile, tablet, desktop)

**Tests:** 17

### 3. Patron Flow (`patronFlow.spec.ts`)
- Patron dashboard with stats
- Browse content with filters
- Subscriptions management
- Watchlist functionality
- Watch history
- Profile & settings pages
- Video watching
- Search functionality
- Creator & series pages

**Tests:** 17

### 4. Creator Flow (`creatorFlow.spec.ts`)
- Creator dashboard with analytics
- Content management (library, upload)
- Analytics (main, simple, patron)
- Patron management
- Content sync from Patreon
- Import history
- Access control & tier management
- Creator settings
- Onboarding flow
- Performance metrics

**Tests:** 17

### 5. Search & Discovery (`searchAndDiscovery.spec.ts`)
- Search with suggestions
- Filter & sort results
- Empty results handling
- Browse by category
- Trending content
- Recommendations
- New releases
- Creator discovery
- Series discovery
- Navigation bar search

**Tests:** 15

### 6. Video Player (`videoPlayer.spec.ts`)
- Video player page loading
- YouTube embed integration
- Watch progress tracking
- Related videos
- Timestamp playback
- Video information display
- Error handling
- Notifications center
- Notification actions

**Tests:** 14

### 7. Continue Watching (`continueWatching.spec.ts`)
- Component rendering
- Watch cards with progress bars
- Navigation to video
- Auto-refresh indicator
- Error states
- Empty states
- Responsive design

**Tests:** 10

## Total Test Count: **97 E2E Tests**

## Running Tests

### Run all E2E tests (headless)
```bash
npm run test:e2e
```

### Run with UI mode (interactive)
```bash
npm run test:e2e:ui
```

### Run with visible browser (headed mode)
```bash
npm run test:e2e:headed
```

### Run in debug mode
```bash
npm run test:e2e:debug
```

### Run specific test file
```bash
npx playwright test e2e/auth.spec.ts
```

### Run specific test by name
```bash
npx playwright test -g "should display login page"
```

## Test Configuration

- **Browser coverage:** Chromium, Firefox, WebKit
- **Base URL:** http://localhost:3000
- **Test directory:** `./e2e`
- **Auto-start dev server:** Yes
- **Retries on CI:** 2
- **Trace collection:** On first retry

## Test Architecture

All tests use **API mocking** to isolate frontend testing:

```typescript
// Mock API responses
await page.route('**/api/v1/patron/continue-watching*', async (route) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ sessions: [...] }),
  });
});
```

### Authentication Mocking

Tests that require authentication inject auth state:

```typescript
await page.addInitScript(() => {
  localStorage.setItem('auth_token', 'mock-token');
  localStorage.setItem('user_role', 'patron');
});
```

## Test Organization

```
e2e/
├── README.md                      # This file
├── auth.spec.ts                   # Authentication flows
├── publicPages.spec.ts            # Public marketing pages
├── patronFlow.spec.ts             # Patron user journeys
├── creatorFlow.spec.ts            # Creator user journeys
├── searchAndDiscovery.spec.ts     # Search & browse
├── videoPlayer.spec.ts            # Video playback & notifications
└── continueWatching.spec.ts       # Continue watching component
```

## Pages Covered (44 total)

### Public (13)
- /, /about, /features, /pricing, /creators, /discover, /browse
- /contact, /blog, /careers, /privacy, /terms
- /search, /metrics

### Authentication (3)
- /auth/login, /auth/signup, /auth/callback

### Patron (8)
- /dashboard, /patron/dashboard, /patron/browse
- /patron/subscriptions, /patron/watchlist, /patron/history
- /patron/profile, /patron/settings, /patron/account

### Creator (12)
- /creator/dashboard, /creator/analytics, /creator/simple-analytics
- /creator/patron-analytics, /creator/content, /creator/content/upload
- /creator/content-library, /creator/access-control
- /creator/import-history, /creator/patrons, /creator/sync
- /creator/settings, /creator/onboarding

### Dynamic (4)
- /watch/[id], /series/[id], /creators/[id], /notifications

### Other (4)
- /patrons, /metrics

## Components Covered

- Navigation (Navbar, AppLayout, Breadcrumbs, Mobile Nav)
- Video Players (YouTube embed, ReactorVideoPlayer)
- Netflix-style components (HeroBanner, ContentRow, ContentGrid)
- Continue Watching component
- Notifications dropdown
- Search bar
- Analytics charts
- UI components (Button, Input, Card, Toast, ThemeToggle)

## Testing Strategy

### 1. **Page Load Tests**
Verify pages render without errors

### 2. **User Interaction Tests**
Test clicks, form submissions, navigation

### 3. **API Integration Tests**
Mock API responses, verify UI updates correctly

### 4. **Error Handling Tests**
Test 404s, 500s, network failures

### 5. **Responsive Tests**
Verify mobile, tablet, desktop layouts

### 6. **Authentication Tests**
Test protected routes, auth flows

## CI/CD Integration

Tests are configured to run in CI with:
- Retry on failure (2 retries)
- Trace collection for debugging
- HTML report generation
- Parallel execution disabled on CI

## Debugging Failed Tests

### View trace
```bash
npx playwright show-trace trace.zip
```

### View HTML report
```bash
npx playwright show-report
```

### Run with browser visible
```bash
npm run test:e2e:headed
```

### Step through test
```bash
npm run test:e2e:debug
```

## Best Practices

1. **Use API mocking** - Don't rely on backend for E2E tests
2. **Test user journeys** - Not implementation details
3. **Use semantic selectors** - getByRole, getByText over CSS selectors
4. **Handle async properly** - Use waitFor, expect assertions
5. **Keep tests independent** - Each test should run in isolation
6. **Mock auth state** - Use localStorage injection for auth tests

## Maintenance

When adding new pages/components:

1. Add test file to `e2e/` directory
2. Mock required API endpoints
3. Test main user flows
4. Update this README with test count
5. Run `npm run test:e2e` to verify

## Coverage Goals

- ✅ 100% page coverage (44/44 pages)
- ✅ 100% critical user flows
- ✅ All authentication flows
- ✅ All video playback scenarios
- ✅ Error states for all pages
- ✅ Responsive design verification
- ✅ Search & discovery flows
- ✅ Content management flows

## Next Steps

- [ ] Add visual regression tests
- [ ] Add performance benchmarks
- [ ] Add accessibility (a11y) tests
- [ ] Add cross-browser matrix testing
- [ ] Integrate with CI/CD pipeline
- [ ] Add test coverage reporting
