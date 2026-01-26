import Link from 'next/link'
import { urlFor } from '@/lib/sanity'
import type { Post } from '@/lib/sanity'
import { formatDate } from '@/lib/utils'

interface RelatedPostsProps {
  posts: Post[]
  currentPostId: string
}

export default function RelatedPosts({ posts, currentPostId }: RelatedPostsProps) {
  // Filter out current post and get up to 3 related posts
  const relatedPosts = posts
    .filter(post => post._id !== currentPostId)
    .slice(0, 3)

  if (relatedPosts.length === 0) return null

  return (
    <section className="mt-16 pt-8 border-t border-gray-300 dark:border-gray-700">
      <h2 className="text-2xl font-medium mb-6">Related Posts</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {relatedPosts.map((post) => {
          const postSlug = typeof post.slug === 'object' ? post.slug.current : post.slug
          const coverImageUrl = post.coverImage?.asset 
            ? urlFor(post.coverImage).width(400).height(250).url() 
            : null

          return (
            <Link
              key={post._id}
              href={`/blog/${postSlug}`}
              className="group block border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
            >
              {coverImageUrl && (
                <div className="aspect-video overflow-hidden bg-gray-100 dark:bg-gray-900">
                  <img
                    src={coverImageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-medium mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                    {post.excerpt}
                  </p>
                )}
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
