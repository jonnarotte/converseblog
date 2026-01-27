import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
})

// Simple auth check
function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const apiKey = process.env.EMAIL_API_KEY || 'your-secret-api-key-change-this'
  
  if (authHeader === `Bearer ${apiKey}`) return true
  
  const url = new URL(request.url)
  const key = url.searchParams.get('key')
  if (key === apiKey) return true
  
  return false
}

// Get all subscribers with stats
export async function GET(request: NextRequest) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'active'
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Get subscribers
    const subscribers = await writeClient.fetch(
      `*[_type == "newsletterSubscriber"${status !== 'all' ? ` && status == "${status}"` : ''}] | order(subscribedAt desc) [${offset}...${offset + limit}] {
        _id,
        email,
        status,
        subscribedAt,
        source,
      }`
    )

    // Get counts
    const totalCount = await writeClient.fetch(
      `count(*[_type == "newsletterSubscriber"])`
    )
    const activeCount = await writeClient.fetch(
      `count(*[_type == "newsletterSubscriber" && status == "active"])`
    )
    const unsubscribedCount = await writeClient.fetch(
      `count(*[_type == "newsletterSubscriber" && status == "unsubscribed"])`
    )

    return NextResponse.json(
      {
        subscribers,
        stats: {
          total: totalCount,
          active: activeCount,
          unsubscribed: unsubscribedCount,
        },
        pagination: {
          limit,
          offset,
          total: totalCount,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get subscribers error:', error)
    return NextResponse.json(
      { error: 'Failed to get subscribers' },
      { status: 500 }
    )
  }
}

// Update subscriber status (unsubscribe, etc.)
export async function PATCH(request: NextRequest) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { email, status } = body

    if (!email || !status) {
      return NextResponse.json(
        { error: 'Email and status required' },
        { status: 400 }
      )
    }

    const subscriber = await writeClient.fetch(
      `*[_type == "newsletterSubscriber" && email == $email][0]`,
      { email }
    )

    if (!subscriber) {
      return NextResponse.json(
        { error: 'Subscriber not found' },
        { status: 404 }
      )
    }

    await writeClient
      .patch(subscriber._id)
      .set({ status })
      .commit()

    return NextResponse.json(
      { success: true, message: 'Subscriber updated' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Update subscriber error:', error)
    return NextResponse.json(
      { error: 'Failed to update subscriber' },
      { status: 500 }
    )
  }
}
