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
const originalFetch = global.fetch
global.fetch = jest.fn((url, options) => {
  const urlString = typeof url === 'string' ? url : url.toString()
  
  if (urlString.includes('api.resend.com')) {
    // Handle different Resend endpoints
    if (urlString.includes('/contacts')) {
      const method = options?.method || 'GET'
      
      if (method === 'GET') {
        // Check if it's a specific contact (has /contacts/email) or list (has ?)
        if (urlString.includes('/contacts/') && !urlString.includes('?')) {
          // Get specific contact - return not found by default (tests will override)
          return Promise.resolve({
            ok: false,
            status: 404,
            json: async () => ({ error: { message: 'not found' } }),
          })
        } else {
          // List contacts - return empty by default (tests will override)
          return Promise.resolve({
            ok: true,
            json: async () => ({
              data: [],
            }),
          })
        }
      } else if (method === 'POST') {
        // Create contact
        return Promise.resolve({
          ok: true,
          status: 201,
          json: async () => {
            let body = {}
            try {
              body = options?.body && typeof options.body === 'string' 
                ? JSON.parse(options.body) 
                : (options?.body || {})
            } catch (e) {
              body = {}
            }
            return {
              id: 'contact-id',
              email: body.email || 'test@example.com',
              unsubscribed: body.unsubscribed || false,
              created_at: new Date().toISOString(),
            }
          },
        })
      } else if (method === 'PATCH') {
        // Update contact
        return Promise.resolve({
          ok: true,
          json: async () => ({
            id: 'contact-id',
            email: url.split('/contacts/')[1]?.split('?')[0] || 'test@example.com',
            unsubscribed: false,
            created_at: new Date().toISOString(),
          }),
        })
      }
    } else if (url.includes('/emails')) {
      // Send email
      return Promise.resolve({
        ok: true,
        json: async () => {
          let body = {}
          try {
            body = options?.body && typeof options.body === 'string' 
              ? JSON.parse(options.body) 
              : (options?.body || {})
          } catch (e) {
            body = {}
          }
          return {
            id: 'test-email-id',
            from: body.from || 'test@example.com',
            to: body.to || [],
            created_at: new Date().toISOString(),
          }
        },
      })
    }
  }
  return Promise.reject(new Error(`Unknown fetch call: ${url}`))
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
