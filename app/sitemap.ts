import { MetadataRoute } from 'next'
import { getAllPostSlugs } from '@/lib/sanity'

// Force dynamic generation for sitemap
export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour
export const runtime = 'nodejs'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  // Static routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]

  // Get all blog post slugs (with error handling)
  try {
    const slugs = await getAllPostSlugs()
    const blogPosts: MetadataRoute.Sitemap = slugs
      .filter((item) => {
        // Filter out items without valid slugs
        if (typeof item.slug === 'object') {
          return item.slug?.current != null
        }
        return item.slug != null
      })
      .map((item) => {
        const slug = typeof item.slug === 'object' && item.slug?.current 
          ? item.slug.current 
          : (typeof item.slug === 'string' ? item.slug : '')
        if (!slug) {
          // Skip if no valid slug (shouldn't happen due to filter, but TypeScript needs this)
          return null
        }
        return {
          url: `${siteUrl}/blog/${slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }
      })
      .filter((item): item is MetadataRoute.Sitemap[0] => item !== null)
    return [...routes, ...blogPosts]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return static routes even if blog posts fail
    return routes
  }
}
