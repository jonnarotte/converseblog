/**
 * @jest-environment node
 */

import { POST } from '@/app/api/newsletter/route'
import { NextRequest } from 'next/server'

// Mock Resend API calls
const mockFetch = global.fetch as jest.Mock

describe('POST /api/newsletter', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Default: contact doesn't exist (404)
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ error: { message: 'not found' } }),
      status: 404,
    })
  })

  it('subscribes email successfully', async () => {
    // Mock: contact doesn't exist (404), then create succeeds (201)
    mockFetch
      .mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: { message: 'not found' } }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({ 
          id: 'contact-id', 
          email: 'test@example.com',
          unsubscribed: false,
          created_at: new Date().toISOString(),
        }),
      })

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

    // Newsletter API returns 201 for new subscriptions
    expect([200, 201]).toContain(response.status)
    expect(data.message).toBeTruthy()
    // Verify Resend API was called to create contact
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/contacts'),
      expect.objectContaining({ method: 'POST' })
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
    // Mock: contact already exists and is subscribed
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        id: 'contact-id',
        email: 'test@example.com',
        unsubscribed: false,
        created_at: new Date().toISOString(),
      }),
    })

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
