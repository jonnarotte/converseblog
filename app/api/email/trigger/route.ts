import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

// This endpoint can be called by Sanity webhooks when a post is published
// Or you can call it manually after publishing a post

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
  const webhookSecret = process.env.WEBHOOK_SECRET || 'your-webhook-secret-change-this'
  
  if (authHeader === `Bearer ${webhookSecret}`) return true
  
  const url = new URL(request.url)
  const key = url.searchParams.get('key')
  if (key === webhookSecret) return true
  
  return false
}

// Trigger email for a specific post
export async function POST(request: NextRequest) {
  try {
    // Check authorization
    if (!isAuthorized(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { postId } = body

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID required' },
        { status: 400 }
      )
    }

    // Call the email send endpoint
    const emailApiUrl = new URL('/api/email/send', process.env.NEXT_PUBLIC_SITE_URL || request.url.split('/api')[0])
    emailApiUrl.searchParams.set('key', process.env.EMAIL_API_KEY || 'your-secret-api-key-change-this')

    const response = await fetch(emailApiUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.EMAIL_API_KEY || 'your-secret-api-key-change-this'}`,
      },
      body: JSON.stringify({
        type: 'blog-post',
        postId,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to send emails', details: result },
        { status: response.status }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Emails triggered successfully',
        result,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Email trigger error:', error)
    return NextResponse.json(
      { error: 'Failed to trigger emails', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
