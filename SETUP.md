# Setup Guide

Complete setup instructions for the Converze Blog.

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Sanity account ([sanity.io](https://www.sanity.io))
- (Optional) Resend account for emails ([resend.com](https://resend.com))

## Initial Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Sanity Project

1. Go to [sanity.io](https://www.sanity.io) and sign up/login
2. Create a new project
3. Choose dataset name (default: "production")
4. Copy your **Project ID** from the dashboard

### 3. Configure Environment Variables

Create `.env.local` in the project root:

```env
# Required: Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id-here
NEXT_PUBLIC_SANITY_DATASET=production

# Required: Sanity API Token (for newsletter, user sessions)
# Get from: https://www.sanity.io/manage → API → Tokens
SANITY_API_TOKEN=your-sanity-api-token-here

# Required: Site URL
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Optional: Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Optional: Search Engine Verification
GOOGLE_SITE_VERIFICATION=your-google-verification-code
BING_VERIFICATION=your-bing-verification-code

# Optional: Email Service (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=noreply@yourdomain.com
EMAIL_API_KEY=your-secret-api-key
WEBHOOK_SECRET=your-webhook-secret
```

### 4. Get Sanity API Token

1. Go to [Sanity Manage](https://www.sanity.io/manage)
2. Select your project
3. Navigate to **API** → **Tokens**
4. Click **Add API token**
5. Name it (e.g., "Newsletter API")
6. Select **Editor** permissions
7. Copy the token to `.env.local`

### 5. Deploy Sanity Schemas

```bash
# Authenticate
npx sanity@latest login

# Deploy schemas
npx sanity@latest schema deploy
```

**Note:** You can also use Studio UI directly - schemas are automatically loaded from `sanity/schemaTypes/`.

### 6. Start Development Server

```bash
npm run dev
```

Visit:
- **Site:** [http://localhost:3000](http://localhost:3000)
- **Studio:** [http://localhost:3000/studio](http://localhost:3000/studio)

## Create Content

### Create an Author

1. Go to Studio → **Authors**
2. Click **Create new**
3. Fill in:
   - Name
   - Slug (auto-generated)
   - Image (optional)
   - Bio (optional)
   - Social Link (optional)
4. Click **Publish**

### Create a Blog Post

1. Go to Studio → **Posts**
2. Click **Create new**
3. Fill in:
   - Title
   - Slug (auto-generated)
   - Excerpt
   - Cover Image (optional)
   - Published Date
   - Authors (select one or more)
   - Content (rich text editor)
4. Click **Publish**

### Update About Page

1. Go to Studio → **About Page**
2. Edit the content
3. Click **Publish**

### Configure Site Settings

1. Go to Studio → **Site Settings**
2. Configure:
   - Organization name
   - Description
   - Email
   - Social media links
   - App download links
   - Legal links

## Optional: Email Newsletter Setup

See [EMAIL.md](./EMAIL.md) for complete email setup instructions.

**Quick Setup:**
1. Sign up at [resend.com](https://resend.com) (free tier: 3,000 emails/month)
2. Get API key from dashboard
3. Add `RESEND_API_KEY` and `EMAIL_FROM` to `.env.local`
4. Test email sending

## Optional: Google Analytics

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a property for your website
3. Get Measurement ID (format: `G-XXXXXXXXXX`)
4. Add to `.env.local` as `NEXT_PUBLIC_GA_ID`

## Optional: Search Engine Verification

### Google Search Console
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your property
3. Choose "HTML tag" verification
4. Copy verification code to `.env.local`

### Bing Webmaster Tools
1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Add your site
3. Get verification code
4. Add to `.env.local`

## Troubleshooting

### Studio Not Loading
- Check `.env.local` has correct Project ID
- Verify you ran `npx sanity@latest login`
- Try: `npx sanity@latest schema deploy`

### No Posts Showing
- Ensure posts are **published** (not just saved as draft)
- Check posts have:
  - A slug
  - Published date
  - At least one author

### Build Errors
- Verify Node.js version: `node --version` (needs 18+)
- Check all environment variables are set
- Ensure Sanity project exists and is accessible

### Newsletter Not Working
- Verify `SANITY_API_TOKEN` is set
- Check token has Editor permissions
- See [EMAIL.md](./EMAIL.md) for troubleshooting

## Next Steps

- Customize design in `components/` and `styles/globals.css`
- Add more fields to schemas in `sanity/schemaTypes/`
- Deploy to production: See [DEPLOYMENT.md](./DEPLOYMENT.md)
