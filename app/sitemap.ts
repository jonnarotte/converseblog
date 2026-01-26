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

  // Get all blog posts with full data for better lastModified dates
  try {
    const { getAllPosts } = await import('@/lib/sanity')
    const posts = await getAllPosts()
    const blogPosts: MetadataRoute.Sitemap = []
    
    for (const post of posts) {
      if (!post) continue
      
      // Extract slug value - handle both string and object formats
      let slugValue: string | null = null
      
      if (post.slug) {
        if (typeof post.slug === 'string') {
          slugValue = post.slug
        } else if (typeof post.slug === 'object' && post.slug !== null && 'current' in post.slug) {
          const slugObj = post.slug as { current?: string | null }
          if (slugObj.current && typeof slugObj.current === 'string') {
            slugValue = slugObj.current
          }
        }
      }
      
      // Only add if we have a valid non-empty slug
      if (slugValue && slugValue.trim() !== '') {
        blogPosts.push({
          url: `${siteUrl}/blog/${slugValue}`,
          lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        })
      }
    }
    
    return [...routes, ...blogPosts]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return static routes even if blog posts fail
    return routes
  }
}
