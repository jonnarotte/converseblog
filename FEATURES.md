# Features

Complete list of features and capabilities.

## Core Features

### Blog System
- ✅ Dynamic blog posts from Sanity CMS
- ✅ Multiple authors per post
- ✅ Cover images with responsive sizing
- ✅ Rich text content with Portable Text
- ✅ Excerpt and metadata
- ✅ Published date tracking

### Theme System
- ✅ Light/Dark theme toggle
- ✅ Per-user theme preferences (cookies + localStorage)
- ✅ Default: Light theme
- ✅ Smooth transitions
- ✅ Accessible with ARIA labels

### Search & Discovery
- ✅ Real-time blog post search
- ✅ Search by title and excerpt
- ✅ URL-based search params
- ✅ Dropdown results with preview
- ✅ Popular/Recent posts widget

### Navigation
- ✅ Breadcrumb navigation
- ✅ Related posts suggestions
- ✅ Back to top button
- ✅ Reading progress indicator (top of page)

### Social Features
- ✅ Share buttons (Twitter, LinkedIn, Facebook)
- ✅ Copy-to-clipboard
- ✅ RSS feed at `/feed.xml`

## Interactive Features

### Reading Progress Bar
- Shows scroll progress at top of page
- Gradient animation
- Works on all pages
- **Award-winning pattern** (seen on Medium, Dev.to)

### Animated Stats Counter
- Numbers animate on scroll
- Gradient text effects
- Shows: Active Users, Voice Recordings, Satisfaction Rate, App Rating
- **Award-winning pattern** (seen on Stripe, Linear)

### Featured Blog Posts
- Shows 3 latest posts on home page
- Card layout with images
- Hover effects
- "View all" link

### Interactive Voice Visualization
- Canvas-based demo
- Animated bars
- Play/pause controls
- Responsive design
- **Unique feature** showcasing product

### Testimonials Carousel
- Auto-rotating testimonials
- Smooth transitions
- Indicator dots
- Social proof section
- **Award-winning pattern** (seen on top SaaS sites)

## Newsletter System

### Subscription
- ✅ Email subscription forms
- ✅ Non-intrusive modal (appears after 30s or 50% scroll)
- ✅ Stores subscribers in Sanity
- ✅ Unsubscribe functionality
- ✅ Source tracking (home/blog/post/modal)

### Email Sending
- ✅ Automatic emails on new posts
- ✅ Manual email campaigns
- ✅ Custom email templates
- ✅ Blog post notification emails
- ✅ Subscriber management API

See [EMAIL.md](./EMAIL.md) for setup.

## SEO Features

### Metadata
- ✅ Comprehensive Open Graph tags
- ✅ Twitter Card metadata
- ✅ Article-specific metadata
- ✅ Keywords and descriptions
- ✅ Canonical URLs

### Structured Data (JSON-LD)
- ✅ Organization schema
- ✅ WebSite schema
- ✅ BlogPosting schema
- ✅ BreadcrumbList schema

### Technical SEO
- ✅ Dynamic sitemap (`/sitemap.xml`)
- ✅ Enhanced robots.txt
- ✅ RSS feed
- ✅ Preconnect/dns-prefetch
- ✅ Mobile-friendly meta tags

## User Management

### Newsletter Subscribers
- Stored in Sanity `newsletterSubscriber` documents
- Tracks: email, status, subscription date, source
- Viewable in Sanity Studio

### User Sessions
- Stored in Sanity `userSession` documents
- Tracks: theme preference, pages visited, user agent
- Analytics-ready

## Performance

- ✅ Static generation where possible
- ✅ ISR (Incremental Static Regeneration)
- ✅ Image optimization
- ✅ Code splitting
- ✅ Lazy loading
- ✅ Optimized bundle size

## Accessibility

- ✅ Semantic HTML
- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Focus indicators

## Responsive Design

- ✅ Mobile-first approach
- ✅ Touch-friendly interactions
- ✅ Adaptive layouts
- ✅ Responsive images
- ✅ Flexible grids

## Customization

All features are customizable:
- Stats numbers and labels
- Testimonials content
- Featured posts count
- Theme colors
- Email templates

See component files for customization options.
