import Link from 'next/link'
import { getAllPosts } from '@/lib/sanity'
import { urlFor } from '@/lib/sanity'
import { formatDate } from '@/lib/utils'

export default async function FeaturedPosts() {
  const posts = await getAllPosts()
  const featured = posts.slice(0, 3) // Get 3 most recent

  if (featured.length === 0) return null

  return (
    <section className="space-y-8" style={{ overflow: 'visible', maxHeight: 'none' }}>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-medium">Latest from the Blog</h2>
        <Link
          href="/blog"
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
        >
          View all →
        </Link>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {featured.map((post) => {
          const postSlug = typeof post.slug === 'object' ? post.slug.current : post.slug
          const coverImageUrl = post.coverImage?.asset 
            ? urlFor(post.coverImage).width(400).height(250).url() 
            : null

          return (
            <Link
              key={post._id}
              href={`/blog/${postSlug}`}
              className="group block border border-gray-300 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-lg"
              style={{ overflow: 'visible' }}
            >
              {coverImageUrl && (
                <div className="aspect-video overflow-hidden bg-gray-100 dark:bg-gray-900">
                  <img
                    src={coverImageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-medium mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                    {post.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                  {post.publishedAt && (
                    <time dateTime={post.publishedAt}>
                      {formatDate(post.publishedAt)}
                    </time>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
