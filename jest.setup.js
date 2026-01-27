// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock environment variables
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'test-project-id'
process.env.NEXT_PUBLIC_SANITY_DATASET = 'test'
process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000'
process.env.RESEND_API_KEY = 'test-resend-key'
process.env.EMAIL_FROM = 'test@example.com'
process.env.EMAIL_API_KEY = 'test-api-key'
process.env.WEBHOOK_SECRET = 'test-webhook-secret'
process.env.SANITY_API_TOKEN = 'test-sanity-token'

// Mock Resend API
global.fetch = jest.fn((url, options) => {
  if (url.includes('api.resend.com')) {
    return Promise.resolve({
      ok: true,
      json: async () => ({
        id: 'test-email-id',
        from: options?.body ? JSON.parse(options.body).from : 'test@example.com',
        to: options?.body ? JSON.parse(options.body).to : [],
        created_at: new Date().toISOString(),
      }),
    })
  }
  return Promise.reject(new Error('Unknown fetch call'))
})

// Mock Sanity client - must be before any imports
const mockFetch = jest.fn(() => Promise.resolve([]))
const mockCreate = jest.fn(() => Promise.resolve({ _id: 'test-id' }))
const mockPatch = {
  set: jest.fn().mockReturnThis(),
  commit: jest.fn(() => Promise.resolve({ _id: 'test-id' })),
}

// Mock the Sanity client module
jest.mock('@sanity/client', () => ({
  createClient: jest.fn(() => ({
    fetch: mockFetch,
    create: mockCreate,
    patch: jest.fn(() => mockPatch),
    withConfig: jest.fn(() => ({
      fetch: mockFetch,
      create: mockCreate,
      patch: jest.fn(() => mockPatch),
    })),
  })),
}))

// Mock the client export
jest.mock('@/sanity/lib/client', () => ({
  client: {
    fetch: mockFetch,
    create: mockCreate,
    patch: jest.fn(() => mockPatch),
    withConfig: jest.fn(() => ({
      fetch: mockFetch,
      create: mockCreate,
      patch: jest.fn(() => mockPatch),
    })),
  },
}))

// Suppress console errors in tests (optional)
// global.console = {
//   ...console,
//   error: jest.fn(),
//   warn: jest.fn(),
// }
