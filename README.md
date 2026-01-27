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

### 5. Run Tests (Before Pushing)

```bash
# Quick test before pushing
npm run test:pre-push

# Or run individually:
npm test              # Unit tests
npm run test:e2e      # E2E tests
npm run test:coverage # With coverage report
```

See [TESTING.md](./TESTING.md) for complete testing guide.

## Documentation

- **[DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)** ⭐ - **Start here!** Complete guide for developers: setup, architecture, design principles, testing, and adding features
- **[SETUP.md](./SETUP.md)** - Complete setup and configuration guide
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - CI/CD deployment guide
- **[TESTING.md](./TESTING.md)** - Complete testing guide for local development
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

The project uses **GitHub Actions CI/CD** with a safe branch-based workflow:

- **`develop` branch**: Builds and tests only (no deployment)
- **`main` branch**: Builds and deploys to production automatically

### Workflow

1. **Develop in `develop`** → Push code, builds automatically
2. **Create PR** → `develop` → `main` for review
3. **Merge to `main`** → Automatic production deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete setup guide.

**Quick start:**
```bash
# Develop
git checkout develop
git push origin develop  # ✅ Builds, no deployment

# Deploy to production
# Create PR: develop → main, then merge
# ✅ Automatic deployment happens
```

## License

Private project for Converze.
