# Testing Setup Instructions

## Prerequisites

All testing dependencies are already installed except for jest-axe. Here's what you have:

### Already Installed ✅
- `@testing-library/react`: ^16.3.0
- `@testing-library/jest-dom`: ^6.8.0
- `@testing-library/user-event`: ^14.6.1
- `@playwright/test`: ^1.55.1
- `jest`: ^30.1.3
- `jest-environment-jsdom`: ^30.1.2

## Installation Steps

### 1. Install Missing Dependencies

```bash
npm install --save-dev jest-axe @axe-core/playwright
```

### 2. Update Jest Setup File

Edit `/Users/david/Code/Playground/ReactorHub/reactorhub-frontend/jest.setup.js` and add:

```javascript
import '@testing-library/jest-dom'
import { toHaveNoViolations } from 'jest-axe'

// Extend Jest matchers with jest-axe
expect.extend(toHaveNoViolations)

// ... rest of existing setup code
```

Complete updated file should look like:

```javascript
import '@testing-library/jest-dom'
import { toHaveNoViolations } from 'jest-axe'

// Extend Jest matchers with jest-axe
expect.extend(toHaveNoViolations)

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.sessionStorage = sessionStorageMock

// Mock window.location if not already defined
if (!window.location) {
  Object.defineProperty(window, 'location', {
    writable: true,
    value: {
      href: 'http://localhost:3000',
      pathname: '/',
      search: '',
      hash: '',
      assign: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
    }
  })
}

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})
```

### 3. Verify Installation

```bash
# Check installed packages
npm list jest-axe @axe-core/playwright

# Should output:
# reactorhub-frontend@0.1.0
# ├── @axe-core/playwright@X.X.X
# └── jest-axe@X.X.X
```

## Running Tests

### Unit & Integration Tests

```bash
# Run all tests
npm test

# Run in watch mode (recommended during development)
npm run test:watch

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- aria-labels.test.tsx

# Run tests matching a pattern
npm test -- --testNamePattern="ARIA"

# Run tests in a specific directory
npm test -- __tests__/accessibility/
```

### E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run with UI mode (interactive)
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# Run specific E2E test
npm run test:e2e -- accessibility.spec.ts

# Debug E2E tests
npm run test:e2e:debug
```

## Expected Output

### Successful Test Run

```
PASS  __tests__/accessibility/aria-labels.test.tsx
PASS  __tests__/accessibility/keyboard-navigation.test.tsx
PASS  __tests__/components/error-states.test.tsx
PASS  __tests__/components/empty-states.test.tsx
PASS  __tests__/components/skeleton-loaders.test.tsx
PASS  __tests__/components/typography.test.tsx
PASS  __tests__/features/advanced-filters.test.tsx
PASS  __tests__/features/analytics-chart.test.tsx
PASS  __tests__/features/onboarding-wizard.test.tsx

Test Suites: 9 passed, 9 total
Tests:       222 passed, 222 total
Snapshots:   0 total
Time:        15.234 s
```

### Coverage Report

```
npm run test:coverage

----------------------|---------|----------|---------|---------|
File                  | % Stmts | % Branch | % Funcs | % Lines |
----------------------|---------|----------|---------|---------|
All files            |   85.23 |    78.45 |   82.67 |   86.12 |
 components/         |   90.12 |    85.23 |   88.45 |   91.23 |
  SearchBar.tsx      |   95.45 |    92.11 |   94.23 |   96.12 |
  Button.tsx         |   88.23 |    82.45 |   85.67 |   89.34 |
 features/           |   82.45 |    75.23 |   78.90 |   83.12 |
  Filters.tsx        |   85.67 |    78.45 |   81.23 |   86.45 |
----------------------|---------|----------|---------|---------|
```

## Troubleshooting

### Issue: jest-axe not found

**Solution:**
```bash
# Reinstall dependencies
npm install
```

### Issue: Tests timing out

**Solution:**
Add timeout to jest.config.js:
```javascript
module.exports = {
  testTimeout: 10000, // 10 seconds
  // ... rest of config
}
```

### Issue: E2E tests failing

**Solution:**
```bash
# Install Playwright browsers
npx playwright install

# Run in headed mode to see what's happening
npm run test:e2e:headed
```

### Issue: Mock not working

**Solution:**
Clear jest cache:
```bash
npm test -- --clearCache
```

### Issue: Coverage too low

**Solution:**
Check which files aren't covered:
```bash
npm run test:coverage -- --verbose
```

## IDE Setup (Optional)

### VS Code

Install recommended extensions:
- Jest Runner
- Playwright Test for VS Code

Add to `.vscode/settings.json`:
```json
{
  "jest.autoRun": "off",
  "jest.showCoverageOnLoad": true,
  "playwright.reuseBrowser": true
}
```

### WebStorm/IntelliJ

1. Enable Jest integration: Settings → Languages & Frameworks → JavaScript → Jest
2. Enable Playwright: Settings → Languages & Frameworks → JavaScript → Playwright

## CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/tests.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm test -- --coverage

      - name: Install Playwright Browsers
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

## Pre-commit Hooks (Optional)

Install husky for pre-commit testing:

```bash
npm install --save-dev husky

# Initialize husky
npx husky init

# Add pre-commit hook
echo "npm test -- --bail --findRelatedTests" > .husky/pre-commit
```

## Quick Reference

### Common Commands

```bash
# Development
npm run test:watch              # Watch mode
npm run test:coverage           # With coverage

# Specific tests
npm test -- aria-labels         # By name
npm test -- --testPathPattern=accessibility  # By path

# E2E
npm run test:e2e:ui            # Interactive mode
npm run test:e2e:debug         # Debug mode

# Utilities
npm test -- --clearCache       # Clear cache
npm test -- --listTests        # List all tests
npm test -- --onlyChanged      # Changed files only
```

### Test File Locations

```
__tests__/
├── accessibility/    # Phase 1 tests
├── components/       # Phase 2 & 3 tests
├── features/         # Phase 4 tests
└── utils/           # Test utilities

e2e/
├── accessibility.spec.ts
├── filters-and-search.spec.ts
└── onboarding.spec.ts
```

## Next Steps

1. ✅ Install dependencies: `npm install --save-dev jest-axe @axe-core/playwright`
2. ✅ Update jest.setup.js with jest-axe
3. ✅ Run unit tests: `npm test`
4. ✅ Run E2E tests: `npm run test:e2e`
5. ✅ Review coverage: `npm run test:coverage`
6. ✅ Set up CI/CD (optional)
7. ✅ Configure IDE (optional)

## Support

For issues or questions:
1. Check test output for specific errors
2. Review test documentation in `__tests__/README.md`
3. Check TEST_SUMMARY.md for comprehensive overview
4. Review individual test files for examples

## Success Criteria

You'll know everything is working when:
- ✅ All 222 unit/integration tests pass
- ✅ All 84 E2E tests pass
- ✅ Coverage is above 80%
- ✅ No accessibility violations found
- ✅ Tests run in < 30 seconds (unit tests)
- ✅ E2E tests complete without errors

Happy Testing! 🎉
