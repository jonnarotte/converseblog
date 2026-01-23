import { client } from '@/sanity/lib/client'
import { postsQuery, postBySlugQuery, postSlugsQuery, aboutQuery } from '@/sanity/lib/queries'
import { PortableText } from '@portabletext/react'
import { urlFor } from '@/sanity/lib/image'
import { cache } from 'react'

export interface Author {
  _id: string
  name: string
  slug?: { current: string }
  image?: any
  bio?: string
  socialLink?: string
}

export interface Post {
  _id: string
  title: string
  slug: { current: string }
  excerpt: string
  publishedAt: string
  coverImage?: any
  content?: any
  authors: Author[]
}

export interface About {
  title: string
  content: any
}

// Cache functions for better performance
const cachedFetch = cache(async (query: string, params: any = {}) => {
  return await client.fetch(query, params)
})

export async function getAllPosts(): Promise<Post[]> {
  return await cachedFetch(postsQuery)
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return await cachedFetch(postBySlugQuery, { slug })
}

export async function getAllPostSlugs(): Promise<{ slug: string }[]> {
  return await cachedFetch(postSlugsQuery)
}

export async function getAboutContent(): Promise<About | null> {
  return await cachedFetch(aboutQuery)
}

export { PortableText, urlFor }
