/**
 * @jest-environment node
 */

import { POST } from '@/app/api/email/send/route'
import { NextRequest } from 'next/server'

// Mock the email service
jest.mock('@/lib/email', () => ({
  sendEmail: jest.fn(),
  createBlogPostEmail: jest.fn(() => '<html>Test Email</html>'),
  createCustomEmail: jest.fn(() => '<html>Custom Email</html>'),
}))

// Mock Resend Contacts API
const mockSubscribers = [
  { email: 'subscriber1@example.com', unsubscribed: false },
  { email: 'subscriber2@example.com', unsubscribed: false },
]

// Mock Sanity client (still needed for fetching blog posts)
jest.mock('@sanity/client', () => {
  const mockFetchFn = jest.fn(() => Promise.resolve([]))
  return {
    createClient: jest.fn(() => ({
      fetch: mockFetchFn,
    })),
  }
})

describe('POST /api/email/send', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.EMAIL_API_KEY = 'test-api-key'
  })

  it('requires authorization', async () => {
    const request = new NextRequest('http://localhost:3000/api/email/send', {
      method: 'POST',
      body: JSON.stringify({ type: 'custom', subject: 'Test', message: 'Test' }),
    })

    const response = await POST(request)
    expect(response.status).toBe(401)
  })

  it('sends custom email with valid auth', async () => {
    const { sendEmail } = require('@/lib/email')
    const mockFetch = global.fetch as jest.Mock
    
    // Mock Resend contacts list API
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockSubscribers }),
    })
    
    sendEmail.mockResolvedValue({ id: 'test-id' })

    const request = new NextRequest(
      'http://localhost:3000/api/email/send?key=test-api-key',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'custom',
          subject: 'Test Subject',
          message: 'Test Message',
        }),
      }
    )

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(sendEmail).toHaveBeenCalled()
  })

  it('sends blog post email', async () => {
    const { sendEmail, createBlogPostEmail } = require('@/lib/email')
    const { createClient } = require('@sanity/client')
    const mockFetch = global.fetch as jest.Mock
    
    // Mock post data
    const mockPost = {
      _id: 'test-post-id',
      title: 'Test Post',
      excerpt: 'Test excerpt',
      slug: { current: 'test-post' },
      publishedAt: '2026-01-27',
      coverImage: null,
      authors: [],
    }
    
    // Mock Resend contacts API (first call)
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockSubscribers }),
    })
    
    // Mock Sanity for post fetch
    const mockClient = createClient()
    mockClient.fetch.mockResolvedValueOnce(mockPost)
    
    sendEmail.mockResolvedValue({ id: 'test-id' })
    createBlogPostEmail.mockReturnValue('<html>Blog Post</html>')

    const request = new NextRequest(
      'http://localhost:3000/api/email/send?key=test-api-key',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'blog-post',
          postId: 'test-post-id',
        }),
      }
    )

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(createBlogPostEmail).toHaveBeenCalled()
  })

  it('validates required fields', async () => {
    const mockFetch = global.fetch as jest.Mock
    
    // Mock Resend contacts (even though validation fails first)
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] }),
    })
    
    const request = new NextRequest(
      'http://localhost:3000/api/email/send?key=test-api-key',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'custom',
          // Missing subject and message
        }),
      }
    )

    const response = await POST(request)
    expect(response.status).toBe(400)
  })
})
