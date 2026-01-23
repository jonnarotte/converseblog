import { urlFor } from '@/lib/sanity'
import type { Post } from '@/lib/sanity'

export function generateStructuredData(post: Post, siteUrl: string) {
  const coverImageUrl = post.coverImage?.asset 
    ? urlFor(post.coverImage).width(1200).height(630).url() 
    : `${siteUrl}/og-image.png`

  const authorData = post.authors?.map(author => ({
    '@type': 'Person',
    name: author.name,
    ...(author.socialLink && { url: author.socialLink }),
  })) || []

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.title,
    image: coverImageUrl,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: authorData,
    publisher: {
      '@type': 'Organization',
      name: 'Converze',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/favicon.svg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${typeof post.slug === 'object' ? post.slug.current : post.slug}`,
    },
  }
}
