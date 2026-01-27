import BlogCard from "@/components/BlogCard"
import Newsletter from "@/components/Newsletter"
import SearchBar from "@/components/SearchBar"
import PopularPosts from "@/components/PopularPosts"
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

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>
}) {
  const posts = await getAllPosts()
  const { search } = await searchParams

  // Filter posts based on search query
  const filteredPosts = search
    ? posts.filter(post => {
        const query = search.toLowerCase()
        const title = post.title.toLowerCase()
        const excerpt = post.excerpt?.toLowerCase() || ''
        return title.includes(query) || excerpt.includes(query)
      })
    : posts

  return (
    <section className="space-y-12 w-full overflow-x-hidden">
      <div className="flex justify-center">
        <SearchBar posts={posts} />
      </div>
      
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {search ? `No posts found for "${search}"` : 'No blog posts yet. Check back soon!'}
          </p>
        </div>
      ) : (
        <>
          {search && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Found {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} for &quot;{search}&quot;
            </p>
          )}
          <div className="grid md:grid-cols-2 gap-4">
            {filteredPosts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
          
          {!search && <PopularPosts posts={posts} />}
          
          <div className="max-w-2xl mx-auto pt-8">
            <Newsletter source="blog" />
          </div>
        </>
      )}
    </section>
  )
}

// Enable ISR for better performance with search
export const revalidate = 60 // Revalidate every 60 seconds
export const dynamic = 'force-dynamic' // Allow dynamic search params

