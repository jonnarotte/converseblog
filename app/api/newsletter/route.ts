import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

// Create a write client for mutations
function getWriteClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const token = process.env.SANITY_API_TOKEN
  
  if (!projectId) {
    throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID is not configured')
  }
  
  if (!token) {
    throw new Error('SANITY_API_TOKEN is not configured. Please add it to your .env.local file.')
  }
  
  return createClient({
    projectId,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    useCdn: false, // Use CDN for reads, but not for writes
    apiVersion: '2024-01-01',
    token,
  })
}

// Simple email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Get client IP address
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  return forwarded?.split(',')[0] || realIP || 'unknown'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, source = 'other' } = body

    // Validate email
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Get write client (will throw if not configured)
    const writeClient = getWriteClient()

    // Check if email already exists
    const existing = await writeClient.fetch(
      `*[_type == "newsletterSubscriber" && email == $email][0]`,
      { email }
    )

    if (existing) {
      // If exists but unsubscribed, reactivate
      if (existing.status === 'unsubscribed') {
        await writeClient
          .patch(existing._id)
          .set({
            status: 'active',
            subscribedAt: new Date().toISOString(),
            source,
            userAgent: request.headers.get('user-agent') || '',
            ipAddress: getClientIP(request),
          })
          .commit()
        
        return NextResponse.json(
          { message: 'Successfully resubscribed!', resubscribed: true },
          { status: 200 }
        )
      }
      
      // Already subscribed
      return NextResponse.json(
        { message: 'You are already subscribed!', alreadySubscribed: true },
        { status: 200 }
      )
    }

    // Create new subscriber
    const subscriber = {
      _type: 'newsletterSubscriber',
      email,
      subscribedAt: new Date().toISOString(),
      status: 'active',
      source,
      userAgent: request.headers.get('user-agent') || '',
      ipAddress: getClientIP(request),
    }

    await writeClient.create(subscriber)

    return NextResponse.json(
      { message: 'Successfully subscribed to newsletter!' },
      { status: 201 }
    )
  } catch (error) {
    // Log detailed error for debugging (server-side only)
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : undefined
    
    console.error('Newsletter subscription error:', {
      message: errorMessage,
      stack: errorStack,
      hasProjectId: !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      hasToken: !!process.env.SANITY_API_TOKEN,
    })
    
    // Check if it's a configuration error
    if (error instanceof Error) {
      if (error.message.includes('SANITY_API_TOKEN') || error.message.includes('not configured')) {
        console.error('❌ Missing Sanity API token configuration')
        return NextResponse.json(
          { error: 'Server configuration error. Please contact support.' },
          { status: 500 }
        )
      }
      
      if (error.message.includes('NEXT_PUBLIC_SANITY_PROJECT_ID') || error.message.includes('not configured')) {
        console.error('❌ Missing Sanity Project ID configuration')
        return NextResponse.json(
          { error: 'Server configuration error. Please contact support.' },
          { status: 500 }
        )
      }
      
      if (error.message.includes('token') || error.message.includes('unauthorized')) {
        console.error('❌ Sanity API authentication failed')
        return NextResponse.json(
          { error: 'Server configuration error. Please contact support.' },
          { status: 500 }
        )
      }
      
      if (error.message.includes('Insufficient permissions') || error.message.includes('permission') || (error as any).statusCode === 403) {
        console.error('❌ Sanity API token lacks required permissions (needs Editor/Admin role)')
        return NextResponse.json(
          { error: 'Server configuration error. Please contact support.' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again later.' },
      { status: 500 }
    )
  }
}

// GET endpoint to check subscription status (optional)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    const writeClient = getWriteClient()
    
    const subscriber = await writeClient.fetch(
      `*[_type == "newsletterSubscriber" && email == $email][0]`,
      { email }
    )

    if (!subscriber) {
      return NextResponse.json({ subscribed: false }, { status: 200 })
    }

    return NextResponse.json(
      {
        subscribed: subscriber.status === 'active',
        status: subscriber.status,
        subscribedAt: subscriber.subscribedAt,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Newsletter check error:', error)
    return NextResponse.json(
      { error: 'Failed to check subscription status' },
      { status: 500 }
    )
  }
}
