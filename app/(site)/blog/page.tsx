import BlogCard from "@/components/BlogCard"
import Newsletter from "@/components/Newsletter"
import { getAllPosts } from "@/lib/sanity"
import type { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Read our latest blog posts about voice analysis, communication, speech patterns, and personal development. Learn how to visualize and transform your voice.',
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
  openGraph: {
    title: 'Blog | Converze',
    description: 'Read our latest blog posts about voice analysis, communication, and personal development.',
    url: `${siteUrl}/blog`,
  },
}

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <section className="space-y-12 w-full overflow-x-hidden">
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No blog posts yet. Check back soon!</p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-4">
            {posts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
          <div className="max-w-2xl mx-auto pt-8">
            <Newsletter />
          </div>
        </>
      )}
    </section>
  )
}

// Enable static generation for better performance
export const revalidate = 60 // Revalidate every 60 seconds
export const dynamic = 'force-static' // Force static generation

