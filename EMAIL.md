# Email Newsletter System

Complete guide for the email newsletter system using Resend.

## Overview

- **Service:** Resend (free tier: 3,000 emails/month, 100/day)
- **Storage:** Subscribers in Sanity (minimal usage)
- **Features:** Automatic emails, manual campaigns, subscriber management

## Setup

### 1. Sign Up for Resend

1. Go to [resend.com](https://resend.com)
2. Sign up for free account
3. Verify your email
4. Go to **API Keys** in dashboard
5. Create new API key
6. Copy the key

### 2. Configure Environment

Add to `.env.local`:

```env
# Resend Email Service
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=noreply@yourdomain.com

# Email API Security (change these!)
EMAIL_API_KEY=your-secret-api-key-change-this
WEBHOOK_SECRET=your-webhook-secret-change-this
```

**Important:**
- For testing, use `onboarding@resend.dev` (Resend's test domain)
- Change `EMAIL_API_KEY` and `WEBHOOK_SECRET` to secure random strings

### 3. Verify Domain (Optional)

1. In Resend dashboard → **Domains**
2. Add your domain
3. Add DNS records
4. Wait for verification
5. Update `EMAIL_FROM` to use your domain

## Usage

### Send Email for New Blog Post

After publishing a post in Sanity:

```bash
curl -X POST "https://yourdomain.com/api/email/trigger?key=your-webhook-secret" \
  -H "Content-Type: application/json" \
  -d '{"postId": "post-id-from-sanity"}'
```

### Send Custom Email

```bash
curl -X POST "https://yourdomain.com/api/email/send?key=your-secret-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "custom",
    "subject": "Important Update",
    "message": "Hello subscribers!",
    "ctaText": "Learn More",
    "ctaUrl": "https://yourdomain.com/news"
  }'
```

### Get Subscriber List

```bash
curl "https://yourdomain.com/api/email/subscribers?key=your-secret-api-key&status=active"
```

## Automatic Emails

### Option 1: Manual Trigger (Recommended)

After publishing a post, call the trigger endpoint with the post ID.

### Option 2: Sanity Webhook

1. Sanity dashboard → **API** → **Webhooks**
2. Create webhook pointing to: `https://yourdomain.com/api/email/trigger`
3. Add header: `Authorization: Bearer your-webhook-secret`
4. Trigger on: Create/Update for `post` documents

## Newsletter Modal

A non-intrusive signup modal appears:
- After 30 seconds on site
- When user scrolls 50% down
- Can be dismissed (won't show again)
- Remembers user choice

## Managing Subscribers

### View in Sanity Studio

1. Go to `/studio`
2. Click **Newsletter Subscriber**
3. See all subscribers with:
   - Email address
   - Status (active/unsubscribed/bounced)
   - Subscription date
   - Source (where they subscribed)

### Unsubscribe

Every email includes an unsubscribe link that automatically updates status in Sanity.

## API Endpoints

### POST `/api/email/send`
Send emails to all active subscribers.

**Body:**
```json
{
  "type": "blog-post" | "custom",
  "postId": "post-id" (if type is blog-post),
  "subject": "Subject" (if type is custom),
  "message": "Message" (if type is custom)
}
```

**Auth:** `Authorization: Bearer EMAIL_API_KEY` or `?key=EMAIL_API_KEY`

### POST `/api/email/trigger`
Trigger email for a specific post.

**Body:**
```json
{
  "postId": "post-id"
}
```

**Auth:** `Authorization: Bearer WEBHOOK_SECRET` or `?key=WEBHOOK_SECRET`

### GET `/api/email/subscribers`
Get subscriber list with stats.

**Query params:**
- `status`: `active` | `unsubscribed` | `all`
- `limit`: number
- `offset`: number

### GET `/unsubscribe?email=user@example.com`
Unsubscribe page (used in email footer).

## Email Limits

**Resend Free Tier:**
- 3,000 emails/month
- 100 emails/day

**Upgrade when needed:**
- Pro: $20/month for 50,000 emails

## Troubleshooting

### Emails Not Sending
- Check `RESEND_API_KEY` is set correctly
- Verify domain in Resend (or use test domain)
- Check Resend dashboard for errors
- Check server logs

### "Unauthorized" Errors
- Make sure `EMAIL_API_KEY` matches in request and `.env.local`
- Use `Authorization: Bearer` header or `?key=` query param

### Subscribers Not Receiving
- Check subscriber status is "active" in Sanity
- Check Resend dashboard for delivery status
- Verify `EMAIL_FROM` domain is verified

## Security

⚠️ **Important:**
- Change `EMAIL_API_KEY` and `WEBHOOK_SECRET` to secure random strings
- Don't commit these to git
- Use environment variables in production
