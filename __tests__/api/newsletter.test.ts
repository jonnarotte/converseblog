/**
 * @jest-environment node
 */

import { POST } from '@/app/api/newsletter/route'
import { NextRequest } from 'next/server'

// Mock is already set up in jest.setup.js

describe('POST /api/newsletter', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('subscribes email successfully', async () => {
    const { createClient } = require('@sanity/client')
    const mockClient = createClient()
    mockClient.fetch.mockResolvedValue([]) // No existing subscriber
    mockClient.create.mockResolvedValue({ _id: 'test-id' })

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
    expect(data.message || data.success).toBeTruthy()
    expect(mockClient.create).toHaveBeenCalled()
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
    const { createClient } = require('@sanity/client')
    const mockClient = createClient()
    mockClient.fetch.mockResolvedValue([{ email: 'test@example.com', status: 'active' }])

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
