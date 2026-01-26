import Link from 'next/link'
import { urlFor } from '@/lib/sanity'
import type { Post } from '@/lib/sanity'
import { formatDate } from '@/lib/utils'

interface PopularPostsProps {
  posts: Post[]
  limit?: number
}

export default function PopularPosts({ posts, limit = 3 }: PopularPostsProps) {
  // Sort by published date (most recent first) - in a real app, you'd sort by views/engagement
  const popularPosts = [...posts]
    .sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
      return dateB - dateA
    })
    .slice(0, limit)

  if (popularPosts.length === 0) return null

  return (
    <section className="border-t border-gray-300 dark:border-gray-700 pt-8 mt-12">
      <h2 className="text-2xl font-medium mb-6">Recent Posts</h2>
      <div className="space-y-4">
        {popularPosts.map((post) => {
          const postSlug = typeof post.slug === 'object' ? post.slug.current : post.slug
          const coverImageUrl = post.coverImage?.asset 
            ? urlFor(post.coverImage).width(200).height(150).url() 
            : null

          return (
            <Link
              key={post._id}
              href={`/blog/${postSlug}`}
              className="flex gap-4 group hover:opacity-80 transition-opacity"
            >
              {coverImageUrl && (
                <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900">
                  <img
                    src={coverImageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                {post.publishedAt && (
                  <time className="text-xs text-gray-500 dark:text-gray-500">
                    {formatDate(post.publishedAt)}
                  </time>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
