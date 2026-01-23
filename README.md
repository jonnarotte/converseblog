# Converze Blog

A minimal, black & white blog site built with Next.js and Sanity CMS for the Converze product.

## Features

- ✅ Dynamic blog posts from Sanity CMS
- ✅ Multiple authors per post (joint posts)
- ✅ Cover images for posts
- ✅ Dark mode toggle
- ✅ Responsive design
- ✅ About page with dynamic content
- ✅ Sanity Studio integrated at `/studio`

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Sanity

1. Create a Sanity account at [sanity.io](https://www.sanity.io)
2. Create a new project
3. Get your Project ID from the Sanity dashboard

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id-here
NEXT_PUBLIC_SANITY_DATASET=production
```

### 4. Deploy Sanity Schema

```bash
npx sanity@latest init --env
npx sanity@latest schema deploy
```

Or use the Sanity Studio at `/studio` to manage your content.

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Content Management

### Access Sanity Studio

Visit `http://localhost:3000/studio` to manage your content.

### Create Your First Author

1. Go to Studio → Authors
2. Click "Create new"
3. Fill in:
   - Name
   - Slug (auto-generated from name)
   - Image (optional)
   - Bio (optional)

### Create Your First Blog Post

1. Go to Studio → Posts
2. Click "Create new"
3. Fill in:
   - Title
   - Slug (auto-generated from title)
   - Excerpt
   - Cover Image (optional)
   - Published Date
   - Authors (select one or more)
   - Content (rich text editor)

### Update About Page

1. Go to Studio → About Page
2. Edit the content
3. Save

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to Google Cloud VM.

**Quick Summary:**
- Build: `npm run build`
- Start: `npm start`
- Use systemd for auto-restart
- Use Nginx as reverse proxy

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── (site)/            # Site routes
│   │   ├── blog/          # Blog pages
│   │   └── about/         # About page
│   ├── studio/            # Sanity Studio route
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── BlogCard.tsx      # Blog post card
│   ├── Navbar.tsx        # Navigation
│   ├── Footer.tsx        # Footer
│   └── ThemeToggle.tsx   # Dark mode toggle
├── sanity/                # Sanity configuration
│   ├── schemaTypes/      # Content schemas
│   └── lib/              # Sanity utilities
├── lib/                   # App utilities
│   └── sanity.ts         # Sanity data fetching
└── public/               # Static assets
```

## Tech Stack

- **Next.js 14** - React framework
- **Sanity CMS** - Headless CMS
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Portable Text** - Rich text rendering

## License

Private project for Converze.
