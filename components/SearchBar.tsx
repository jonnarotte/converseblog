'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface SearchBarProps {
  posts: Array<{
    _id: string
    title: string
    slug: { current: string } | string
    excerpt?: string
  }>
}

export default function SearchBar({ posts }: SearchBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('search') || '')
  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState(false)

  const filteredPosts = query
    ? posts.filter(post => {
        const title = post.title.toLowerCase()
        const excerpt = post.excerpt?.toLowerCase() || ''
        const searchQuery = query.toLowerCase()
        return title.includes(searchQuery) || excerpt.includes(searchQuery)
      }).slice(0, 5)
    : []

  const handleSearch = (value: string) => {
    setQuery(value)
    setIsOpen(value.length > 0)
    
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set('search', value)
      } else {
        params.delete('search')
      }
      router.push(`/blog?${params.toString()}`, { scroll: false })
    })
  }

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <input
          type="search"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsOpen(query.length > 0)}
          placeholder="Search blog posts..."
          className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-black focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {isPending && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      
      {isOpen && filteredPosts.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {filteredPosts.map((post) => {
            const postSlug = typeof post.slug === 'object' ? post.slug.current : post.slug
            return (
              <Link
                key={post._id}
                href={`/blog/${postSlug}`}
                onClick={() => setIsOpen(false)}
                className="block p-4 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors border-b border-gray-200 dark:border-gray-800 last:border-b-0"
              >
                <h3 className="font-medium mb-1">{post.title}</h3>
                {post.excerpt && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {post.excerpt}
                  </p>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
