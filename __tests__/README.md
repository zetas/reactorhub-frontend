# Test Suite Documentation

This test suite provides comprehensive coverage for all UX/UI improvements made in Phases 1-4.

## Test Structure

```
__tests__/
├── accessibility/           # Phase 1 Accessibility Tests
│   ├── aria-labels.test.tsx
│   └── keyboard-navigation.test.tsx
├── components/              # Phase 2 & 3 Component Tests
│   ├── error-states.test.tsx
│   ├── empty-states.test.tsx
│   ├── skeleton-loaders.test.tsx
│   └── typography.test.tsx
├── features/                # Phase 4 Advanced Features Tests
│   ├── advanced-filters.test.tsx
│   ├── analytics-chart.test.tsx
│   └── onboarding-wizard.test.tsx
└── utils/                   # Test utilities
    ├── test-utils.tsx
    └── mocks.tsx
```

## Running Tests

### Unit & Integration Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- aria-labels.test.tsx

# Run tests matching a pattern
npm test -- --testNamePattern="ARIA"
```

### E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run E2E tests in headed mode
npm run test:e2e:headed

# Run specific E2E test file
npm run test:e2e -- accessibility.spec.ts

# Debug E2E tests
npm run test:e2e:debug
```

## Test Coverage by Phase

### Phase 1 - Accessibility (Critical)

**File: `__tests__/accessibility/aria-labels.test.tsx`**
- ARIA labels on all interactive elements
- Accessible names for buttons and form controls
- Screen reader text for icon buttons
- Modal accessibility (role, aria-labelledby, aria-modal)
- Navigation landmarks
- Image alt text
- Form error associations (aria-describedby, aria-invalid)

**File: `__tests__/accessibility/keyboard-navigation.test.tsx`**
- Tab key navigation through interactive elements
- Shift+Tab backwards navigation
- Enter/Space key activation
- Escape key to close modals
- Focus indicators visibility
- Focus trap in modals
- Focus restoration after modal close
- Skip links and custom focus management

### Phase 2 - Error Handling & Empty States

**File: `__tests__/components/error-states.test.tsx`**
- Network error display
- Server error messages
- Validation errors
- Retry button functionality
- Loading state during retry
- Form field error display
- Error boundary implementation
- Color contrast compliance for errors
- Touch target sizes (44x44px minimum)
- Error announcements (aria-live)

**File: `__tests__/components/empty-states.test.tsx`**
- No search results state
- Empty content lists (creators, videos, subscriptions)
- Empty watch history
- Empty favorites
- Conditional empty states (search vs filter)
- Call-to-action buttons
- Empty state illustrations
- Accessibility (role="status", aria-live)

### Phase 3 - Typography & Loading States

**File: `__tests__/components/skeleton-loaders.test.tsx`**
- Skeleton component rendering
- Multiple skeleton items
- Content card skeletons
- Loading to content transitions
- Spinner loading states
- React Query loading states
- Progressive loading indicators
- Skeleton accessibility (aria-label, aria-busy)
- Loading button states

**File: `__tests__/components/typography.test.tsx`**
- Typography scale (h1-h6, body, small)
- Font weights (light, normal, medium, semibold, bold)
- Line heights (tight, normal, relaxed, loose)
- Text colors with proper contrast
- Spacing consistency (padding, margin, gap)
- Responsive typography
- Text truncation and line clamp
- Text alignment
- Letter spacing
- Safe area padding for mobile
- Dark mode typography

### Phase 4 - Advanced Features

**File: `__tests__/features/advanced-filters.test.tsx`**
- Duration filter (short, medium, long)
- Status filter (checkboxes for multiple selection)
- Sort options (newest, oldest, popular, title, duration)
- Combined filters
- Clear all filters
- Active filter tags
- Remove individual filters
- Filter persistence
- Results count updates
- Filter accessibility

**File: `__tests__/features/analytics-chart.test.tsx`**
- Line chart rendering
- Bar chart rendering
- Chart accessibility (ARIA labels)
- Data table alternative for screen readers
- Time range selector
- Metric cards with trends
- Chart loading states
- Export functionality
- Responsive charts
- Chart legend and tooltips

**File: `__tests__/features/onboarding-wizard.test.tsx`**
- Multi-step wizard navigation
- Progress indicator
- Step validation
- Form data persistence across steps
- Back/Next navigation
- Skip functionality
- Wizard completion
- Success message
- ARIA attributes (role="dialog", progressbar)
- Keyboard navigation
- Step change announcements

## E2E Tests

### File: `e2e/accessibility.spec.ts`

Comprehensive accessibility testing using Playwright and axe-core:
- No WCAG violations on all pages
- Navigation landmarks
- Accessible search inputs
- Button accessibility
- Image alt text
- Keyboard navigation (Tab, Shift+Tab, Enter, Space, Escape)
- Focus indicators
- Focus trap in modals
- Form labels and required fields
- Color contrast (WCAG AA)
- Heading hierarchy
- Semantic HTML
- ARIA live regions
- Touch target sizes (mobile)
- Responsive accessibility (mobile, tablet, desktop)

### File: `e2e/filters-and-search.spec.ts`

End-to-end filter and search functionality:
- Search for creators
- Clear search button
- No results message
- Search query in URL
- Duration filter (short, medium, long)
- Category filter
- Sort options (newest, popular, title)
- Multiple filters combined
- Clear all filters
- Active filter tags
- Filter persistence on refresh
- Results count display
- Filter accessibility
- Mobile filter experience

### File: `e2e/onboarding.spec.ts`

Complete onboarding flow testing:
- Wizard display for new users
- Progress indicator
- Navigation through all steps
- Back/forward navigation
- Personal information collection
- Interests selection
- Preferences configuration
- Wizard completion
- Skip functionality
- Data persistence
- Accessibility (keyboard, ARIA)
- Mobile experience
- Touch-friendly buttons

## Required Dependencies

Make sure these packages are installed:

```bash
npm install --save-dev jest-axe @axe-core/playwright
```

Add to `jest.setup.js`:

```javascript
import { toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)
```

## Best Practices

### Unit Tests
1. Test user behavior, not implementation details
2. Use semantic queries (getByRole, getByLabelText)
3. Mock external dependencies (API calls, React Query)
4. Test accessibility (ARIA attributes, keyboard navigation)
5. Test both success and failure scenarios

### E2E Tests
1. Mock API responses for consistency
2. Use data-testid sparingly (prefer accessible queries)
3. Wait for elements properly (avoid arbitrary timeouts)
4. Test critical user journeys
5. Test across different viewports

### Accessibility Tests
1. Use axe-core for automated accessibility checks
2. Test keyboard navigation manually
3. Verify ARIA attributes
4. Check color contrast
5. Test with screen reader text

## Coverage Goals

- **Unit Tests**: 80%+ coverage on changed files
- **Integration Tests**: All critical user flows
- **E2E Tests**: Complete user journeys
- **Accessibility**: Zero WCAG violations

## Continuous Integration

Tests should run in CI/CD pipeline:

```yaml
# Example GitHub Actions
- name: Run unit tests
  run: npm test -- --coverage

- name: Run E2E tests
  run: npm run test:e2e
```

## Troubleshooting

### Common Issues

1. **Tests timing out**: Increase timeout or fix async handling
2. **Flaky E2E tests**: Add proper waits, avoid race conditions
3. **Mock issues**: Ensure mocks are cleared between tests
4. **ARIA violations**: Fix accessibility issues in components

### Debug Commands

```bash
# Run single test file with verbose output
npm test -- --verbose aria-labels.test.tsx

# Debug E2E test
npm run test:e2e:debug -- accessibility.spec.ts

# Run tests with node inspector
node --inspect-brk node_modules/.bin/jest --runInBand
```

## Contributing

When adding new features:
1. Write tests BEFORE implementing (TDD)
2. Follow existing test patterns
3. Ensure all tests pass
4. Add test documentation
5. Update this README if needed
