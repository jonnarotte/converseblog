import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'
import { sendEmail, createBlogPostEmail, createCustomEmail, listContacts } from '@/lib/email'

// Create a read-only client for fetching posts (still need Sanity for blog content)
const readClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
})

// Simple auth check (you should use proper authentication in production)
function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const apiKey = process.env.EMAIL_API_KEY || 'your-secret-api-key-change-this'
  
  // Check for API key in header or query param
  if (authHeader === `Bearer ${apiKey}`) return true
  
  const url = new URL(request.url)
  const key = url.searchParams.get('key')
  if (key === apiKey) return true
  
  return false
}

// Send email to all active subscribers
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
    const { type, postId, subject, message, ctaText, ctaUrl } = body

    // Get all active subscribers from Resend
    const contactsResponse = await listContacts({ limit: 1000 })
    const subscribers = contactsResponse.data?.filter((contact: any) => !contact.unsubscribed) || []

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json(
        { error: 'No active subscribers found' },
        { status: 400 }
      )
    }

    const emails = subscribers.map((contact: any) => contact.email)
    let emailHtml = ''
    let emailSubject = ''

    if (type === 'blog-post' && postId) {
      // Get post data from Sanity (still need Sanity for blog content)
      const post = await readClient.fetch(
        `*[_type == "post" && _id == $postId][0] {
          _id,
          title,
          excerpt,
          slug,
          publishedAt,
          coverImage {
            asset->{
              url
            }
          },
          "authors": authors[]->{
            name
          }
        }`,
        { postId }
      )

      if (!post) {
        return NextResponse.json(
          { error: 'Post not found' },
          { status: 404 }
        )
      }

      emailSubject = `New Blog Post: ${post.title}`
      emailHtml = createBlogPostEmail({
        ...post,
        coverImage: post.coverImage ? { asset: { url: post.coverImage.asset?.url } } : undefined,
      })
    } else if (type === 'custom' && subject && message) {
      emailSubject = subject
      emailHtml = createCustomEmail(subject, message, ctaText, ctaUrl)
    } else {
      return NextResponse.json(
        { error: 'Invalid email type or missing required fields' },
        { status: 400 }
      )
    }

    // Replace {{email}} placeholder with actual email for unsubscribe links
    const results = []
    const errors = []

    // Send emails in batches (Resend allows up to 50 recipients per request)
    const batchSize = 50
    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize)
      
      try {
        // Replace email placeholder for each batch
        const personalizedHtml = batch.map(email => 
          emailHtml.replace(/\{\{email\}\}/g, encodeURIComponent(email))
        ).join('---SPLIT---') // Temporary separator, we'll send individually

        // Send to each recipient individually for proper personalization
        for (const email of batch) {
          try {
            const personalizedEmailHtml = emailHtml.replace(/\{\{email\}\}/g, encodeURIComponent(email))
            await sendEmail({
              to: email,
              subject: emailSubject,
              html: personalizedEmailHtml,
            })
            results.push({ email, status: 'sent' })
          } catch (error) {
            console.error(`Failed to send to ${email}:`, error)
            errors.push({ email, error: error instanceof Error ? error.message : 'Unknown error' })
          }
        }
      } catch (error) {
        console.error('Batch send error:', error)
        errors.push({ batch, error: error instanceof Error ? error.message : 'Unknown error' })
      }
    }

    return NextResponse.json(
      {
        success: true,
        sent: results.length,
        failed: errors.length,
        total: emails.length,
        results,
        errors: errors.length > 0 ? errors : undefined,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Email send error:', error)
    return NextResponse.json(
      { error: 'Failed to send emails', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// GET endpoint to check email service status
export async function GET(request: NextRequest) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get subscriber count from Resend
    const contactsResponse = await listContacts({ limit: 1000 })
    const subscriberCount = contactsResponse.data?.filter((contact: any) => !contact.unsubscribed).length || 0

    const hasEmailService = !!process.env.RESEND_API_KEY

    return NextResponse.json(
      {
        emailServiceConfigured: hasEmailService,
        activeSubscribers: subscriberCount,
        service: hasEmailService ? 'Resend' : 'Not configured',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Email status check error:', error)
    return NextResponse.json(
      { error: 'Failed to check email status' },
      { status: 500 }
    )
  }
}
