import { NextRequest, NextResponse } from 'next/server'
import { listContacts } from '@/lib/email'

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

    // Get subscribers from Resend
    const contactsResponse = await listContacts({ limit: 1000 })
    let allContacts = contactsResponse.data || []

    // Filter by status
    if (status !== 'all') {
      allContacts = allContacts.filter((contact: any) => {
        if (status === 'active') return !contact.unsubscribed
        if (status === 'unsubscribed') return contact.unsubscribed
        return true
      })
    }

    // Paginate
    const paginatedContacts = allContacts.slice(offset, offset + limit)

    // Format response
    const subscribers = paginatedContacts.map((contact: any) => ({
      email: contact.email,
      status: contact.unsubscribed ? 'unsubscribed' : 'active',
      subscribedAt: contact.created_at,
      firstName: contact.first_name,
      lastName: contact.last_name,
    }))

    // Get counts
    const totalCount = allContacts.length
    const activeCount = allContacts.filter((c: any) => !c.unsubscribed).length
    const unsubscribedCount = allContacts.filter((c: any) => c.unsubscribed).length

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

    const { createOrUpdateContact } = await import('@/lib/email')
    
    await createOrUpdateContact(email, {
      unsubscribed: status === 'unsubscribed',
    })

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
