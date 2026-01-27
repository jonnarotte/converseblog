# Testing Guide

Complete guide for testing the Converze Blog application locally before pushing to remote.

## Quick Start

```bash
# Run unit & integration tests (default)
npm test

# Before pushing - runs type check + tests + build
npm run test:pre-push

# E2E tests (requires Playwright setup - run separately)
npm run test:e2e
```

## Test Types

### 1. Unit Tests (Jest + React Testing Library)

Tests individual components and functions in isolation.

```bash
# Run unit tests
npm test

# Watch mode (auto-rerun on changes)
npm run test:watch

# With coverage
npm run test:coverage
```

**What's tested:**
- Component rendering
- User interactions
- Utility functions
- Email service functions

**Example:**
```bash
npm test -- Logo.test.tsx
```

### 2. Integration Tests

Tests API routes and service integrations.

```bash
npm test -- __tests__/api/
```

**What's tested:**
- Email API endpoints
- Newsletter API
- Sanity integration
- Authentication

### 3. E2E Tests (Playwright) - Optional

E2E tests are excluded from default `npm test` and require separate setup.

```bash
# Install Playwright browsers first
npx playwright install

# Run E2E tests (headless)
npm run test:e2e

# Run with UI (interactive)
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed
```

**Note:** E2E tests are optional and excluded from pre-push checks. Run manually when needed.

## Local Testing Workflow

### Before Making Changes

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Run tests in watch mode:**
   ```bash
   npm run test:local
   ```

3. **In another terminal, run E2E tests:**
   ```bash
   npm run test:e2e:ui
   ```

### Testing Specific Features

#### Test Resend Email Integration

1. **Set up test environment:**
   ```bash
   cp .test.env.example .env.test.local
   # Edit .env.test.local with test credentials
   ```

2. **Run email tests:**
   ```bash
   npm test -- email.test.ts
   ```

3. **Test email API locally:**
   ```bash
   # Start dev server
   npm run dev
   
   # In another terminal, test API
   curl -X POST "http://localhost:3000/api/email/send?key=test-api-key" \
     -H "Content-Type: application/json" \
     -d '{"type":"custom","subject":"Test","message":"Test message"}'
   ```

#### Test Sanity Studio

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Open Studio:**
   ```
   http://localhost:3000/studio
   ```

3. **Run E2E test:**
   ```bash
   npm run test:e2e -- sanity-studio.spec.ts
   ```

#### Test UI Changes

1. **Visual testing:**
   ```bash
   npm run dev
   # Manually test in browser
   ```

2. **Component tests:**
   ```bash
   npm run test:watch
   # Tests run automatically on file changes
   ```

3. **E2E tests:**
   ```bash
   npm run test:e2e:headed
   # See browser interactions
   ```

## Test Structure

```
├── __tests__/              # Unit & Integration tests
│   ├── components/        # Component tests
│   ├── lib/               # Utility function tests
│   └── api/               # API route tests
├── e2e/                   # End-to-end tests
│   ├── homepage.spec.ts
│   ├── blog.spec.ts
│   └── sanity-studio.spec.ts
├── jest.config.js         # Jest configuration
├── jest.setup.js          # Test setup & mocks
└── playwright.config.ts   # Playwright configuration
```

## Writing Tests

### Component Test Example

```typescript
import { render, screen } from '@testing-library/react'
import MyComponent from '@/components/MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

### API Test Example

```typescript
import { POST } from '@/app/api/my-route/route'
import { NextRequest } from 'next/server'

describe('POST /api/my-route', () => {
  it('handles request correctly', async () => {
    const request = new NextRequest('http://localhost:3000/api/my-route', {
      method: 'POST',
      body: JSON.stringify({ data: 'test' }),
    })
    
    const response = await POST(request)
    expect(response.status).toBe(200)
  })
})
```

### E2E Test Example

```typescript
import { test, expect } from '@playwright/test'

test('user can complete flow', async ({ page }) => {
  await page.goto('/')
  await page.click('button')
  await expect(page).toHaveURL('/next-page')
})
```

## Pre-Commit Testing

### Option 1: Manual (Recommended)

Before committing:
```bash
npm run test:ci      # Quick unit tests
npm run test:e2e     # E2E tests
npm run type-check   # TypeScript check
```

### Option 2: Git Hooks (Optional)

Create `.husky/pre-commit`:
```bash
#!/bin/sh
npm run test:ci && npm run type-check
```

## CI/CD Integration

Tests run automatically in GitHub Actions:
- Unit tests on every push
- E2E tests on PRs
- Full test suite before deployment

## Mocking

### Mocked Services

- **Resend API**: Mocked in `jest.setup.js`
- **Sanity Client**: Mocked in `jest.setup.js`
- **Next.js Router**: Mocked in `jest.setup.js`

### Custom Mocks

Create mocks in `__mocks__/` directory:
```typescript
// __mocks__/my-service.ts
export const myService = {
  method: jest.fn(() => Promise.resolve({})),
}
```

## Troubleshooting

### EMFILE: Too Many Open Files (macOS)

If `npm run test:watch` fails with "EMFILE: too many open files":

**Quick Fix:**
```bash
# Increase limit for current session
ulimit -n 4096
npm run test:watch
```

**Permanent Fix:**
```bash
# Run the fix script
./scripts/fix-file-watchers.sh

# Or manually add to ~/.zshrc:
echo "ulimit -n 4096" >> ~/.zshrc
source ~/.zshrc
```

**Alternative:** Use `npm test` (runs once) instead of watch mode during development.


### Tests fail locally but pass in CI

1. Clear cache:
   ```bash
   npm test -- --clearCache
   ```

2. Reinstall dependencies:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### E2E tests timeout

1. Increase timeout in `playwright.config.ts`
2. Check if dev server is running
3. Verify `.env.local` has correct values

### Sanity Studio tests fail

1. Ensure `NEXT_PUBLIC_SANITY_PROJECT_ID` is set
2. Check Sanity credentials in `.env.local`
3. Verify network connectivity

## Best Practices

1. **Write tests first** (TDD) for new features
2. **Test user behavior**, not implementation
3. **Keep tests fast** - unit tests should be < 100ms
4. **Mock external services** - don't hit real APIs
5. **Test edge cases** - empty states, errors, etc.
6. **Update tests** when changing features

## Coverage Goals

- **Components**: 70%+ coverage
- **API Routes**: 80%+ coverage
- **Utilities**: 90%+ coverage
- **E2E**: Critical user flows covered

Check coverage:
```bash
npm run test:coverage
```

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [Next.js Testing](https://nextjs.org/docs/app/building-your-application/testing)
