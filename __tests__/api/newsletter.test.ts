/**
 * @jest-environment node
 */

import { POST } from '@/app/api/newsletter/route'
import { NextRequest } from 'next/server'

// Mock Sanity client
jest.mock('@/sanity/lib/client', () => ({
  client: {
    fetch: jest.fn(() => Promise.resolve([])),
    create: jest.fn(() => Promise.resolve({ _id: 'test-id' })),
  },
}))

describe('POST /api/newsletter', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('subscribes email successfully', async () => {
    const { client } = require('@/sanity/lib/client')
    client.create.mockResolvedValue({ _id: 'test-id' })

    const request = new NextRequest('http://localhost:3000/api/newsletter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        source: 'home',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(client.create).toHaveBeenCalledWith(
      expect.objectContaining({
        _type: 'newsletterSubscriber',
        email: 'test@example.com',
      })
    )
  })

  it('validates email format', async () => {
    const request = new NextRequest('http://localhost:3000/api/newsletter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'invalid-email',
        source: 'home',
      }),
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
  })

  it('handles duplicate email', async () => {
    const { client } = require('@/sanity/lib/client')
    client.fetch.mockResolvedValue([{ email: 'test@example.com' }])

    const request = new NextRequest('http://localhost:3000/api/newsletter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        source: 'home',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.message).toContain('already subscribed')
  })
})
