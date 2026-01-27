// Email service using Resend (free tier: 3,000 emails/month, 100/day)
// Alternative: You can use SendGrid, Mailgun, or any other service

interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  from?: string
}

// Simple fetch-based email sending (works with Resend API)
export async function sendEmail({ to, subject, html, from }: EmailOptions) {
  const apiKey = process.env.RESEND_API_KEY
  const fromEmail = from || process.env.EMAIL_FROM || 'noreply@converze.com'

  if (!apiKey) {
    console.error('RESEND_API_KEY not configured')
    throw new Error('Email service not configured')
  }

  // Resend API endpoint
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: fromEmail,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    console.error('Email sending error:', error)
    throw new Error(`Failed to send email: ${error.message || 'Unknown error'}`)
  }

  return await response.json()
}

// Email template for new blog post
export function createBlogPostEmail(post: {
  title: string
  excerpt: string
  slug: string | { current: string }
  publishedAt: string
  coverImage?: { asset?: { url?: string } }
  authors?: Array<{ name: string }>
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const postSlug = typeof post.slug === 'object' && post.slug?.current 
    ? post.slug.current 
    : (typeof post.slug === 'string' ? post.slug : '')
  const postUrl = `${siteUrl}/blog/${postSlug}`
  const authorNames = post.authors?.map(a => a.name).join(', ') || 'Converze Team'
  const coverImageUrl = post.coverImage?.asset?.url || `${siteUrl}/og-image.png`

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${post.title}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px;">
    <h1 style="color: #000; font-size: 24px; font-weight: 600; margin: 0 0 16px 0;">New Blog Post: ${post.title}</h1>
    
    ${post.coverImage ? `
    <div style="margin: 0 0 20px 0;">
      <img src="${coverImageUrl}" alt="${post.title}" style="width: 100%; height: auto; border-radius: 6px;" />
    </div>
    ` : ''}
    
    <p style="color: #666; font-size: 16px; margin: 0 0 20px 0;">${post.excerpt}</p>
    
    <div style="margin: 24px 0; padding: 16px; background: #f9fafb; border-radius: 6px;">
      <p style="margin: 0 0 8px 0; font-size: 14px; color: #666;">
        <strong>Author:</strong> ${authorNames}
      </p>
      <p style="margin: 0; font-size: 14px; color: #666;">
        <strong>Published:</strong> ${new Date(post.publishedAt).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </p>
    </div>
    
    <a href="${postUrl}" style="display: inline-block; background: #3b82f6; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 500; margin: 20px 0;">
      Read Full Article →
    </a>
    
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
    
    <p style="font-size: 12px; color: #999; margin: 0;">
      You're receiving this because you subscribed to the Converze newsletter.<br />
      <a href="${siteUrl}/unsubscribe?email={{email}}" style="color: #3b82f6; text-decoration: none;">Unsubscribe</a>
    </p>
  </div>
</body>
</html>
  `.trim()
}

// Generic email template for custom messages
export function createCustomEmail(subject: string, message: string, ctaText?: string, ctaUrl?: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px;">
    <div style="white-space: pre-wrap; font-size: 16px; margin: 0 0 24px 0;">${message}</div>
    
    ${ctaText && ctaUrl ? `
    <a href="${ctaUrl}" style="display: inline-block; background: #3b82f6; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 500;">
      ${ctaText} →
    </a>
    ` : ''}
    
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
    
    <p style="font-size: 12px; color: #999; margin: 0;">
      You're receiving this because you subscribed to the Converze newsletter.<br />
      <a href="${siteUrl}/unsubscribe?email={{email}}" style="color: #3b82f6; text-decoration: none;">Unsubscribe</a>
    </p>
  </div>
</body>
</html>
  `.trim()
}
