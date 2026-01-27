import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

// Create a write client for mutations
const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
})

// Get client IP address
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  return forwarded?.split(',')[0] || realIP || 'unknown'
}

// Track session activity
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, theme, page, action = 'visit' } = body

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      )
    }

    // Check if session exists
    const existingSession = await writeClient.fetch(
      `*[_type == "userSession" && sessionId == $sessionId][0]`,
      { sessionId }
    )

    if (existingSession) {
      // Update existing session
      const updates: any = {
        lastActivity: new Date().toISOString(),
        isActive: true,
      }

      if (theme) {
        updates.theme = theme
      }

      if (page && action === 'visit') {
        const pagesVisited = existingSession.pagesVisited || []
        if (!pagesVisited.includes(page)) {
          updates.pagesVisited = [...pagesVisited, page]
        }
      }

      await writeClient
        .patch(existingSession._id)
        .set(updates)
        .commit()
    } else {
      // Create new session
      const newSession = {
        _type: 'userSession',
        sessionId,
        startedAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        theme: theme || 'light',
        userAgent: request.headers.get('user-agent') || '',
        ipAddress: getClientIP(request),
        referrer: request.headers.get('referer') || '',
        pagesVisited: page ? [page] : [],
        isActive: true,
      }

      await writeClient.create(newSession)
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Session tracking error:', error)
    // Don't fail the request if tracking fails
    return NextResponse.json({ success: false }, { status: 200 })
  }
}

// Generate new session ID
export async function GET() {
  try {
    // Generate a simple session ID (you can use uuid if installed)
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
    return NextResponse.json({ sessionId }, { status: 200 })
  } catch (error) {
    console.error('Session ID generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate session ID' },
      { status: 500 }
    )
  }
}
