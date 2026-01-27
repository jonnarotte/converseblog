# Converze Blog

A modern, feature-rich blog built with Next.js and Sanity CMS for the Converze product.

## Features

- ✅ **Dynamic Blog Posts** - Content managed through Sanity CMS
- ✅ **Multiple Authors** - Support for joint posts
- ✅ **Dark/Light Theme** - Per-user theme preferences
- ✅ **Newsletter System** - Email subscriptions with Resend
- ✅ **SEO Optimized** - Structured data, sitemap, RSS feed
- ✅ **Interactive Features** - Reading progress, animated stats, testimonials
- ✅ **Search Functionality** - Real-time blog post search
- ✅ **Social Sharing** - Share buttons on posts
- ✅ **Related Posts** - Automatic related content suggestions
- ✅ **Sanity Studio** - Integrated at `/studio`

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env.local`:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-api-token
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### 3. Deploy Sanity Schemas

```bash
npx sanity@latest login
npx sanity@latest schema deploy
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Documentation

- **[SETUP.md](./SETUP.md)** - Complete setup and configuration guide
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - 3-stage deployment to GCloud VM
- **[FEATURES.md](./FEATURES.md)** - All features and capabilities
- **[EMAIL.md](./EMAIL.md)** - Newsletter and email setup

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── (site)/            # Site routes
│   │   ├── blog/          # Blog pages
│   │   └── about/         # About page
│   ├── api/               # API routes
│   │   ├── email/         # Email sending
│   │   └── newsletter/    # Newsletter subscriptions
│   ├── studio/            # Sanity Studio
│   └── layout.tsx         # Root layout
├── components/            # React components
├── sanity/                # Sanity configuration
│   ├── schemaTypes/      # Content schemas
│   └── lib/              # Sanity utilities
├── lib/                   # App utilities
└── scripts/              # Deployment scripts
```

## Tech Stack

- **Next.js 16** - React framework with App Router
- **Sanity CMS** - Headless content management
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Resend** - Email delivery service

## Deployment

The project uses a **3-stage deployment system**:

1. **Local Build** - Build on your machine
2. **Transfer** - Upload build to VM (no source code)
3. **VM Deploy** - Run application on VM

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete guide.

**Quick Deploy:**
```bash
./scripts/deploy-all.sh
```

## License

Private project for Converze.
