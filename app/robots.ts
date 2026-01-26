import { MetadataRoute } from 'next'

// Force dynamic generation for robots.txt
export const dynamic = 'force-dynamic'
export const revalidate = 86400 // Revalidate daily

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/studio/', '/api/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/studio/', '/api/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}

// Ensure this route is always accessible
export const runtime = 'nodejs'
