# Developer Guide

Complete guide for developers working on the Converze Blog project. This document covers local setup, architecture, design principles, testing, and how to add new features.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Project Architecture](#project-architecture)
3. [Design Principles](#design-principles)
4. [Local Development Setup](#local-development-setup)
5. [External Integrations](#external-integrations)
6. [Testing Locally](#testing-locally)
7. [Adding New Features](#adding-new-features)
8. [Code Organization](#code-organization)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Prerequisites

- **Node.js 20+** (check with `node --version`)
- **npm** (comes with Node.js)
- **Git**
- **Sanity account** (for CMS access)
- **Resend account** (for email service)

### Initial Setup

```bash
# 1. Clone the repository
git clone <repository-url>
cd converseblog

# 2. Install dependencies
npm install

# 3. Copy environment template
cp .env.example .env.local

# 4. Configure environment variables (see below)

# 5. Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## Project Architecture

### Tech Stack

- **Next.js 16** (App Router) - React framework
- **TypeScript** - Type safety
- **Sanity CMS** - Headless content management
- **Tailwind CSS** - Utility-first styling
- **Resend** - Email delivery
- **Jest + React Testing Library** - Unit testing
- **Playwright** - E2E testing

### Architecture Patterns

#### 1. **App Router (Next.js 13+)**
- File-based routing in `app/` directory
- Server Components by default (better performance)
- Client Components when needed (`'use client'`)
- Route groups: `(site)` for organization

#### 2. **Component-Based Architecture**
- Reusable components in `components/`
- Server Components for data fetching
- Client Components for interactivity
- Shared utilities in `lib/`

#### 3. **API Routes**
- RESTful API endpoints in `app/api/`
- Server-side only (no client exposure)
- Environment-based configuration

#### 4. **Content Management**
- Sanity CMS for content
- Schema-driven content types
- Real-time preview support
- Studio integrated at `/studio`

### Directory Structure

```
converseblog/
├── app/                      # Next.js App Router
│   ├── (site)/              # Route group (site pages)
│   │   ├── blog/            # Blog listing & posts
│   │   ├── about/           # About page
│   │   └── layout.tsx       # Site layout
│   ├── api/                 # API routes
│   │   ├── email/           # Email endpoints
│   │   └── newsletter/      # Newsletter subscriptions
│   ├── studio/              # Sanity Studio
│   └── layout.tsx           # Root layout
├── components/               # React components
│   ├── Newsletter.tsx       # Newsletter form
│   ├── SearchBar.tsx        # Search functionality
│   └── ...
├── lib/                     # Utility functions
│   ├── email.ts             # Email service
│   ├── sanity.ts            # Sanity client
│   └── utils.ts             # General utilities
├── sanity/                  # Sanity configuration
│   ├── schemaTypes/         # Content schemas
│   └── lib/                 # Sanity utilities
├── __tests__/               # Unit & integration tests
├── e2e/                     # E2E tests
└── scripts/                 # Build & deployment scripts
```

---

## Design Principles

### 1. **Separation of Concerns**

- **Data Layer**: Sanity CMS, API routes
- **Presentation Layer**: React components
- **Business Logic**: Utility functions in `lib/`
- **Styling**: Tailwind CSS (utility-first)

### 2. **Server-First Approach**

- Use Server Components by default
- Fetch data on the server
- Minimize client-side JavaScript
- Better performance and SEO

### 3. **Type Safety**

- TypeScript for all code
- Type definitions for Sanity schemas
- Type-safe API routes
- No `any` types (use `unknown` if needed)

### 4. **Progressive Enhancement**

- Core functionality works without JavaScript
- Enhancements added with client components
- Accessible by default
- Mobile-first responsive design

### 5. **Performance First**

- Static generation where possible
- Image optimization
- Code splitting
- Minimal JavaScript bundle

### 6. **Maintainability**

- Clear file organization
- Consistent naming conventions
- Comprehensive documentation
- Test coverage for critical paths

### 7. **Flexibility & Extensibility**

- Modular component design
- Configurable via environment variables
- Plugin-like architecture for features
- Easy to add new content types

---

## Local Development Setup

### Environment Configuration

Create `.env.local` with required variables:

```env
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-api-token

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Email Service (Resend)
RESEND_API_KEY=re_your-api-key
EMAIL_FROM=noreply@converze.org

# Optional
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
EMAIL_API_KEY=your-secret-key
WEBHOOK_SECRET=your-webhook-secret
```

### Sanity Setup

1. **Login to Sanity:**
   ```bash
   npx sanity@latest login
   ```

2. **Deploy schemas:**
   ```bash
   npx sanity@latest schema deploy
   ```

3. **Access Studio:**
   - Visit `http://localhost:3000/studio`
   - Create content types
   - Add test content

### Development Workflow

```bash
# Start dev server (with hot reload)
npm run dev

# Run in separate terminals:
npm run dev          # Terminal 1: Dev server
npm test             # Terminal 2: Run tests
npm run test:watch   # Terminal 3: Watch tests
```

### Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run start            # Start production server

# Testing
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
npm run test:e2e         # E2E tests
npm run test:pre-push    # Full pre-push check

# Code Quality
npm run type-check       # TypeScript check
npm run lint             # ESLint
```

---

## External Integrations

### 1. Sanity CMS

**Purpose**: Content management for blog posts, authors, settings

**Setup:**
1. Create account at [sanity.io](https://sanity.io)
2. Create new project
3. Get Project ID and API token
4. Configure in `.env.local`

**Usage:**
```typescript
// Fetch posts
import { client } from '@/sanity/lib/client'
const posts = await client.fetch(`*[_type == "post"]`)

// Create content
await client.create({
  _type: 'post',
  title: 'New Post',
  // ...
})
```

**Schema Location**: `sanity/schemaTypes/`

**Studio Access**: `http://localhost:3000/studio`

### 2. Resend (Email Service)

**Purpose**: Send newsletter emails, transactional emails

**Setup:**
1. Create account at [resend.com](https://resend.com)
2. Get API key
3. Verify domain (for production)
4. Configure in `.env.local`

**Usage:**
```typescript
import { sendEmail } from '@/lib/email'

await sendEmail({
  to: 'user@example.com',
  subject: 'Welcome!',
  html: '<p>Welcome to our newsletter</p>',
})
```

**API Location**: `lib/email.ts`

### 3. Google Analytics (Optional)

**Purpose**: Track website analytics

**Setup:**
1. Create GA4 property
2. Get Measurement ID (G-XXXXXXXXXX)
3. Add to `.env.local` as `NEXT_PUBLIC_GA_ID`

**Usage**: Automatically loaded in `components/GoogleAnalytics.tsx`

### 4. Testing Services

**Jest**: Unit and integration tests
- Configuration: `jest.config.js`
- Setup: `jest.setup.js`
- Tests: `__tests__/`

**Playwright**: E2E tests
- Configuration: `playwright.config.ts`
- Tests: `e2e/`
- Requires: Dev server running

---

## Testing Locally

### Test Types

#### 1. **Unit Tests** (Jest)
Test individual components and functions:

```bash
npm test                    # Run all
npm test -- Logo.test.tsx   # Specific test
npm run test:watch          # Watch mode
```

**Location**: `__tests__/components/`, `__tests__/lib/`

#### 2. **Integration Tests** (Jest)
Test API routes and service integrations:

```bash
npm test -- __tests__/api/
```

**Location**: `__tests__/api/`

#### 3. **E2E Tests** (Playwright)
Test complete user flows:

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Run E2E tests
npm run test:e2e           # Headless
npm run test:e2e:ui         # Interactive UI
npm run test:e2e:headed     # See browser
```

**Location**: `e2e/`

### Pre-Push Testing

Before pushing code, run:

```bash
npm run test:pre-push
```

This runs:
- ✅ TypeScript type check
- ✅ Unit & integration tests
- ✅ Production build test
- ⏭️ E2E tests (skipped, run manually)

### Writing Tests

#### Component Test Example

```typescript
// __tests__/components/MyComponent.test.tsx
import { render, screen } from '@testing-library/react'
import MyComponent from '@/components/MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

#### API Test Example

```typescript
// __tests__/api/my-route.test.ts
import { POST } from '@/app/api/my-route/route'
import { NextRequest } from 'next/server'

describe('POST /api/my-route', () => {
  it('handles request', async () => {
    const request = new NextRequest('http://localhost:3000/api/my-route', {
      method: 'POST',
      body: JSON.stringify({ data: 'test' }),
    })
    
    const response = await POST(request)
    expect(response.status).toBe(200)
  })
})
```

### Test Coverage

Current coverage goals:
- **Global**: 30% (minimum)
- **Critical paths** (email, API): 60-80%

View coverage:
```bash
npm run test:coverage
```

---

## Adding New Features

### Step-by-Step Guide

#### 1. **Plan the Feature**

- Define requirements
- Identify affected components
- Consider data model changes
- Plan testing approach

#### 2. **Create Feature Branch**

```bash
git checkout develop
git pull origin develop
git checkout -b feature/my-new-feature
```

#### 3. **Implement the Feature**

**For UI Components:**
```bash
# Create component
touch components/MyNewComponent.tsx

# Add to page
# Edit app/(site)/page.tsx or relevant page
```

**For API Routes:**
```bash
# Create route
mkdir -p app/api/my-feature
touch app/api/my-feature/route.ts
```

**For Content Types:**
```bash
# Create schema
touch sanity/schemaTypes/myContent.ts
# Register in sanity/schemaTypes/index.ts
```

#### 4. **Add Tests**

```bash
# Component test
touch __tests__/components/MyNewComponent.test.tsx

# API test
touch __tests__/api/my-feature.test.ts
```

#### 5. **Test Locally**

```bash
# Run tests
npm test

# Test manually
npm run dev
# Visit http://localhost:3000
```

#### 6. **Type Check**

```bash
npm run type-check
```

#### 7. **Commit & Push**

```bash
git add .
git commit -m "feat: add my new feature"
git push origin feature/my-new-feature
```

#### 8. **Create Pull Request**

- PR from `feature/my-new-feature` → `develop`
- Review checklist:
  - [ ] Tests pass
  - [ ] Type check passes
  - [ ] No console errors
  - [ ] Documentation updated

### Feature Examples

#### Adding a New Page

1. **Create page file:**
   ```typescript
   // app/(site)/new-page/page.tsx
   export default function NewPage() {
     return <div>New Page Content</div>
   }
   ```

2. **Add to navigation** (if needed):
   ```typescript
   // components/Navbar.tsx
   <Link href="/new-page">New Page</Link>
   ```

#### Adding a New API Endpoint

1. **Create route:**
   ```typescript
   // app/api/my-endpoint/route.ts
   import { NextRequest, NextResponse } from 'next/server'
   
   export async function GET(request: NextRequest) {
     return NextResponse.json({ message: 'Hello' })
   }
   ```

2. **Add test:**
   ```typescript
   // __tests__/api/my-endpoint.test.ts
   // ... test implementation
   ```

#### Adding a New Content Type

1. **Create schema:**
   ```typescript
   // sanity/schemaTypes/myContent.ts
   export default {
     name: 'myContent',
     type: 'document',
     fields: [
       { name: 'title', type: 'string' },
       // ...
     ],
   }
   ```

2. **Register schema:**
   ```typescript
   // sanity/schemaTypes/index.ts
   import myContent from './myContent'
   export const schemaTypes = [myContent, ...]
   ```

3. **Deploy schema:**
   ```bash
   npx sanity@latest schema deploy
   ```

---

## Code Organization

### File Naming Conventions

- **Components**: PascalCase (`MyComponent.tsx`)
- **Utilities**: camelCase (`myUtility.ts`)
- **API Routes**: lowercase (`route.ts`)
- **Tests**: Same as source + `.test.tsx`
- **Types**: PascalCase (`MyType.ts`)

### Component Structure

```typescript
// 1. Imports
import { useState } from 'react'
import Link from 'next/link'

// 2. Types/Interfaces
interface MyComponentProps {
  title: string
  optional?: boolean
}

// 3. Component
export default function MyComponent({ title, optional }: MyComponentProps) {
  // 4. Hooks
  const [state, setState] = useState('')
  
  // 5. Handlers
  const handleClick = () => {
    // ...
  }
  
  // 6. Render
  return (
    <div>
      <h1>{title}</h1>
      {/* ... */}
    </div>
  )
}
```

### Import Order

1. React/Next.js imports
2. Third-party libraries
3. Internal components
4. Utilities
5. Types
6. Styles

### Code Comments

- **Use JSDoc for functions:**
  ```typescript
  /**
   * Sends an email using Resend API
   * @param to - Recipient email address
   * @param subject - Email subject
   * @returns Promise with email ID
   */
  export async function sendEmail(...) { }
  ```

- **Explain "why", not "what":**
  ```typescript
  // Good: Explains reasoning
  // Use Server Component to avoid client-side JavaScript
  
  // Bad: States the obvious
  // This is a Server Component
  ```

---

## Best Practices

### 1. **Performance**

- ✅ Use Server Components by default
- ✅ Optimize images with Next.js Image
- ✅ Lazy load heavy components
- ✅ Minimize client-side JavaScript
- ✅ Use `next/dynamic` for code splitting

### 2. **Accessibility**

- ✅ Semantic HTML
- ✅ ARIA labels where needed
- ✅ Keyboard navigation
- ✅ Focus management
- ✅ Color contrast (WCAG AA)

### 3. **SEO**

- ✅ Metadata for all pages
- ✅ Structured data (JSON-LD)
- ✅ Semantic HTML
- ✅ Sitemap and robots.txt
- ✅ Open Graph tags

### 4. **Error Handling**

- ✅ Try-catch for async operations
- ✅ User-friendly error messages
- ✅ Error boundaries for React
- ✅ Logging for debugging

### 5. **Security**

- ✅ Environment variables for secrets
- ✅ Input validation
- ✅ Sanitize user input
- ✅ Rate limiting for APIs
- ✅ HTTPS in production

### 6. **TypeScript**

- ✅ No `any` types
- ✅ Explicit return types
- ✅ Type-safe API routes
- ✅ Interface over type (preference)

### 7. **Git Workflow**

- ✅ Work in `develop` branch
- ✅ Feature branches for new work
- ✅ Descriptive commit messages
- ✅ PRs for code review
- ✅ Test before pushing

---

## Troubleshooting

### Common Issues

#### 1. **Environment Variables Not Working**

**Problem**: Variables not accessible in app

**Solution**:
- Use `NEXT_PUBLIC_` prefix for client-side variables
- Restart dev server after changing `.env.local`
- Check variable names match exactly

#### 2. **Sanity Connection Errors**

**Problem**: Cannot fetch content from Sanity

**Solution**:
- Verify `NEXT_PUBLIC_SANITY_PROJECT_ID` in `.env.local`
- Check `SANITY_API_TOKEN` is set
- Verify dataset name matches
- Check network connectivity

#### 3. **TypeScript Errors**

**Problem**: Type errors in code

**Solution**:
```bash
# Clear cache
rm -rf .next node_modules
npm install

# Check types
npm run type-check
```

#### 4. **Test Failures**

**Problem**: Tests failing locally

**Solution**:
- Clear Jest cache: `npm test -- --clearCache`
- Check mocks in `jest.setup.js`
- Verify environment variables in tests
- Run specific test: `npm test -- MyTest.test.tsx`

#### 5. **Build Errors**

**Problem**: Production build fails

**Solution**:
```bash
# Clean build
rm -rf .next
npm run build

# Check for TypeScript errors
npm run type-check
```

#### 6. **E2E Tests Not Running**

**Problem**: Playwright errors

**Solution**:
```bash
# Reinstall browsers
npx playwright install --force

# Ensure dev server is running
npm run dev  # Terminal 1
npm run test:e2e  # Terminal 2
```

### Getting Help

1. Check this guide first
2. Review [TESTING.md](./TESTING.md) for test issues
3. Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment issues
4. Review error messages carefully
5. Check GitHub Issues (if public)
6. Ask team members

---

## Quick Reference

### Essential Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run start            # Start production server

# Testing
npm test                 # Run tests
npm run test:pre-push    # Full check before push
npm run type-check       # TypeScript validation

# Sanity
npx sanity@latest login  # Login to Sanity
npx sanity@latest schema deploy  # Deploy schemas
```

### Important Files

- `.env.local` - Environment variables
- `jest.config.js` - Test configuration
- `next.config.js` - Next.js configuration
- `sanity.config.ts` - Sanity configuration
- `tailwind.config.js` - Tailwind configuration

### Key Directories

- `app/` - Next.js routes and pages
- `components/` - React components
- `lib/` - Utility functions
- `sanity/` - Sanity CMS configuration
- `__tests__/` - Unit and integration tests
- `e2e/` - E2E tests

---

## Next Steps

1. ✅ Complete local setup
2. ✅ Understand architecture
3. ✅ Set up external integrations
4. ✅ Run tests locally
5. ✅ Start building features!

**Happy coding! 🚀**
