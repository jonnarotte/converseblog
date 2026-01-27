# Converze Blog

A modern, production-ready blog built with Next.js 16, Sanity CMS, and Resend for email management.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Sanity account
- Resend account (for newsletter)

### Installation

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Deploy Sanity schemas
npx sanity@latest login
npx sanity@latest schema deploy

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
converseblog/
├── app/                      # Next.js App Router
│   ├── (site)/               # Public site routes
│   │   ├── blog/             # Blog listing & posts
│   │   ├── about/            # About page
│   │   └── layout.tsx        # Site layout
│   ├── api/                  # API routes
│   │   ├── email/            # Email sending
│   │   └── newsletter/       # Newsletter subscriptions (Resend)
│   ├── studio/               # Sanity Studio (/studio)
│   └── layout.tsx            # Root layout
├── components/                # React components
│   ├── BlogCard.tsx          # Blog post card
│   ├── Newsletter.tsx         # Newsletter form
│   ├── SearchBar.tsx         # Blog search
│   └── ...
├── lib/                      # Utilities
│   ├── email.ts              # Resend API helpers
│   ├── sanity.ts             # Sanity client & queries
│   └── utils.ts              # General utilities
├── sanity/                   # Sanity configuration
│   ├── schemaTypes/          # Content schemas
│   └── lib/                  # Sanity utilities
├── scripts/                  # Build & deployment
│   ├── copy-static.js        # Post-build file copying
│   ├── test-local.sh         # Pre-push test runner
│   └── verify-build.sh       # Build verification
└── styles/
    └── globals.css            # Global styles & scrollbar management
```

## 🛠️ Tech Stack

- **Next.js 16** - React framework with App Router
- **Sanity CMS** - Headless content management
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Resend** - Email delivery & newsletter management
- **Jest** - Unit testing
- **Playwright** - E2E testing

## 📚 Documentation

- **[DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)** - Complete developer guide: architecture, design principles, testing, adding features
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - CI/CD deployment guide (GitHub Actions)

## 🧪 Testing

```bash
# Run all tests
npm run test:pre-push

# Individual test commands
npm test              # Unit tests
npm run test:coverage # With coverage
npm run test:e2e      # E2E tests
npm run type-check    # TypeScript check
```

## 🚢 Deployment

**CI/CD Pipeline (GitHub Actions):**
- `develop` branch → Builds and tests only
- `main` branch → Builds and deploys to production

**Workflow:**
1. Develop in `develop` branch
2. Create PR: `develop` → `main`
3. Merge PR → Automatic deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete setup.

## 🎨 Key Features

- ✅ Dynamic blog posts (Sanity CMS)
- ✅ Newsletter subscriptions (Resend)
- ✅ Dark/Light theme
- ✅ SEO optimized (structured data, sitemap, RSS)
- ✅ Search functionality
- ✅ Sanity Studio at `/studio`
- ✅ Responsive design
- ✅ Performance optimized

## 📝 Environment Variables

Required in `.env.local`:

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-api-token

# Resend (for newsletter)
RESEND_API_KEY=your-resend-api-key

# Site
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## 📄 License

Private project for Converze.
