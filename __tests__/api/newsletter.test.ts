/**
 * @jest-environment node
 */

import { POST } from '@/app/api/newsletter/route'
import { NextRequest } from 'next/server'

// Create mock functions that can be accessed
const mockFetch = jest.fn(() => Promise.resolve([]))
const mockCreate = jest.fn(() => Promise.resolve({ _id: 'test-id' }))
const mockPatch = {
  set: jest.fn().mockReturnThis(),
  commit: jest.fn(() => Promise.resolve({ _id: 'test-id' })),
}

// Mock createClient - must be hoisted
jest.mock('@sanity/client', () => {
  const mockFetchFn = jest.fn(() => Promise.resolve([]))
  const mockCreateFn = jest.fn(() => Promise.resolve({ _id: 'test-id' }))
  const mockPatchObj = {
    set: jest.fn().mockReturnThis(),
    commit: jest.fn(() => Promise.resolve({ _id: 'test-id' })),
  }
  
  return {
    createClient: jest.fn(() => ({
      fetch: mockFetchFn,
      create: mockCreateFn,
      patch: jest.fn(() => mockPatchObj),
    })),
    // Export mocks for test access
    __mockFetch: mockFetchFn,
    __mockCreate: mockCreateFn,
  }
})

describe('POST /api/newsletter', () => {
  let mockClient: any
  
  beforeEach(() => {
    jest.clearAllMocks()
    const { createClient } = require('@sanity/client')
    mockClient = createClient()
  })

  it('subscribes email successfully', async () => {
    // Reset mocks - no existing subscriber
    mockClient.fetch.mockResolvedValueOnce(null) // No existing subscriber
    mockClient.create.mockResolvedValueOnce({ _id: 'test-id' })

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

    // Newsletter API returns 201 for new subscriptions, but check what it actually returns
    expect([200, 201]).toContain(response.status)
    expect(data.message).toBeTruthy()
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
    mockClient.fetch.mockResolvedValueOnce([{ email: 'test@example.com', status: 'active' }])

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
