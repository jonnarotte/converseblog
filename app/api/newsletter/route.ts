import { NextRequest, NextResponse } from 'next/server'
import { createOrUpdateContact, getContact } from '@/lib/email'

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

    // Check if contact already exists in Resend
    const existing = await getContact(email)

    if (existing) {
      // If unsubscribed, reactivate
      if (existing.unsubscribed) {
        await createOrUpdateContact(email, { unsubscribed: false })
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

    // Create new contact in Resend
    await createOrUpdateContact(email, { unsubscribed: false })

    return NextResponse.json(
      { message: 'Successfully subscribed to newsletter!' },
      { status: 201 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    
    console.error('Newsletter subscription error:', {
      message: errorMessage,
      hasResendKey: !!process.env.RESEND_API_KEY,
    })
    
    if (error instanceof Error) {
      if (error.message.includes('RESEND_API_KEY') || error.message.includes('not configured')) {
        console.error('❌ Missing Resend API key configuration')
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

    const contact = await getContact(email)

    if (!contact) {
      return NextResponse.json({ subscribed: false }, { status: 200 })
    }

    return NextResponse.json(
      {
        subscribed: !contact.unsubscribed,
        status: contact.unsubscribed ? 'unsubscribed' : 'active',
        subscribedAt: contact.created_at,
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
