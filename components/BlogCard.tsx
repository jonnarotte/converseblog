'use client'

import Link from "next/link"
import { urlFor } from "@/lib/sanity"
import type { Post } from "@/lib/sanity"

interface BlogCardProps {
  post: Post
}

export default function BlogCard({ post }: BlogCardProps) {
  // Handle cover image - check if it has asset data, don't constrain dimensions
  const coverImageUrl = post.coverImage?.asset 
    ? urlFor(post.coverImage).url() 
    : null
  const slug = typeof post.slug === 'object' ? post.slug.current : post.slug

  // Format date as "January 15" format
  const formattedDate = post.publishedAt 
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric'
      })
    : null

  return (
    <div className="group border border-gray-300 dark:border-gray-700 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200">
      {/* Date and Author at top */}
      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
        {formattedDate && (
          <span>{formattedDate}</span>
        )}
        {post.authors && post.authors.length > 0 && (
          <>
            {formattedDate && <span>•</span>}
            <div className="flex items-center gap-2 flex-wrap">
              {post.authors.map((author, idx) => {
                const authorImageUrl = author.image?.asset 
                  ? urlFor(author.image).width(24).height(24).url() 
                  : null
                
                const authorContent = (
                  <>
                    {authorImageUrl && (
                      <img
                        src={authorImageUrl}
                        alt={author.name}
                        className="w-6 h-6 rounded-full object-cover border border-gray-300 dark:border-gray-700"
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                    <span>{author.name}</span>
                  </>
                )

                return author.socialLink ? (
                  <a
                    key={author._id}
                    href={author.socialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                  >
                    {authorContent}
                  </a>
                ) : (
                  <span key={author._id} className="flex items-center gap-1.5">
                    {authorContent}
                  </span>
                )
              })}
            </div>
          </>
        )}
      </div>

      <Link
        href={`/blog/${slug}`}
        className="block"
        prefetch={true}
      >
        {coverImageUrl && (
          <div className="w-full mb-3 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-900 relative">
            <img
              src={coverImageUrl}
              alt={post.title}
              className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
              style={{ maxWidth: '100%', height: 'auto', maxHeight: '200px', objectFit: 'contain' }}
              loading="lazy"
              decoding="async"
            />
          </div>
        )}
        
        <h2 className="text-lg font-medium mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {post.title}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">{post.excerpt}</p>
        <span className="text-sm text-blue-600 dark:text-blue-400 font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
          Read more
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </Link>
    </div>
  )
}

