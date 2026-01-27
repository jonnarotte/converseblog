import { NextRequest, NextResponse } from 'next/server'
import { getContact, createOrUpdateContact } from '@/lib/email'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')

  if (!email) {
    return new Response('Email parameter required', { status: 400 })
  }

  try {
    const decodedEmail = decodeURIComponent(email)
    
    // Check if contact exists in Resend
    const contact = await getContact(decodedEmail)

    if (!contact) {
      return new Response('Subscriber not found', { status: 404 })
    }

    // Unsubscribe in Resend
    await createOrUpdateContact(decodedEmail, { unsubscribed: true })

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    
    // Return HTML page
    return new Response(
      `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unsubscribed</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: #f9fafb;
    }
    .container {
      background: white;
      padding: 32px;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      text-align: center;
      max-width: 400px;
    }
    h1 { color: #000; margin: 0 0 16px 0; }
    p { color: #666; margin: 0 0 24px 0; }
    a {
      color: #3b82f6;
      text-decoration: none;
    }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Successfully Unsubscribed</h1>
    <p>You have been unsubscribed from the Converze newsletter. You will no longer receive email updates.</p>
    <p><a href="${siteUrl}">Return to website</a></p>
  </div>
</body>
</html>`,
      {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
      }
    )
  } catch (error) {
    console.error('Unsubscribe error:', error)
    return new Response('Failed to unsubscribe', { status: 500 })
  }
}
