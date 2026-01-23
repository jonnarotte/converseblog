import { notFound } from "next/navigation"
import { getAllPostSlugs, getPostBySlug, PortableText, urlFor } from "@/lib/sanity"
import { portableTextComponents } from "@/components/PortableTextComponents"
import { generateStructuredData } from "./structured-data"
import type { Metadata } from 'next'

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs()
  return slugs.map((item) => ({
    slug: item.slug,
  }))
}

// Enable ISR for better performance
export const revalidate = 60 // Revalidate every 60 seconds
export const dynamicParams = false // Only allow pre-generated slugs

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const coverImageUrl = post.coverImage?.asset 
    ? urlFor(post.coverImage).width(1200).height(630).url() 
    : `${siteUrl}/og-image.png`

  const postSlug = typeof post.slug === 'object' ? post.slug.current : post.slug

  return {
    title: post.title,
    description: post.excerpt || `Read ${post.title} on Converze blog`,
    authors: post.authors?.map(author => ({ name: author.name })) || [],
    alternates: {
      canonical: `${siteUrl}/blog/${postSlug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt || `Read ${post.title} on Converze blog`,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: post.authors?.map(author => author.name) || [],
      url: `${siteUrl}/blog/${postSlug}`,
      images: [
        {
          url: coverImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || `Read ${post.title} on Converze blog`,
      images: [coverImageUrl],
    },
  }
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  // Handle cover image - check if it has asset data, don't constrain dimensions
  const coverImageUrl = post.coverImage?.asset 
    ? urlFor(post.coverImage).url() 
    : null
  const coverImageDimensions = post.coverImage?.asset?.metadata?.dimensions
  const coverWidth = coverImageDimensions?.width || 1200
  const coverHeight = coverImageDimensions?.height || 600
  const coverAspectRatio = coverWidth / coverHeight
  const isCoverVertical = coverAspectRatio < 1

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const structuredData = generateStructuredData(post, siteUrl)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <article className="max-w-3xl mx-auto space-y-8 w-full overflow-x-hidden" itemScope itemType="https://schema.org/BlogPosting">
      <div className="space-y-4">
        <h1 className="text-4xl font-medium" itemProp="headline">{post.title}</h1>

        {post.excerpt && (
          <p className="text-xl text-gray-600 dark:text-gray-400" itemProp="description">{post.excerpt}</p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-sm">
          {post.publishedAt && (
            <time className="text-gray-500 dark:text-gray-400" dateTime={post.publishedAt} itemProp="datePublished">
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </time>
          )}
          {post.authors && post.authors.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-gray-500 dark:text-gray-400">By</span>
              {post.authors.map((author, idx) => {
                const authorImageUrl = author.image?.asset 
                  ? urlFor(author.image).width(40).height(40).url() 
                  : null
                
                return author.socialLink ? (
                  <a
                    key={author._id}
                    href={author.socialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity group"
                  >
                    {authorImageUrl && (
                      <img
                        src={authorImageUrl}
                        alt={author.name}
                        className="w-8 h-8 rounded-full object-cover border border-gray-300 dark:border-gray-700"
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                    <span className="text-blue-600 dark:text-blue-400 font-medium group-hover:underline">
                      {author.name}
                    </span>
                    {idx < post.authors.length - 1 && <span className="text-gray-500">,</span>}
                  </a>
                ) : (
                  <span key={author._id} className="flex items-center gap-2">
                    {authorImageUrl && (
                      <img
                        src={authorImageUrl}
                        alt={author.name}
                        className="w-8 h-8 rounded-full object-cover border border-gray-300 dark:border-gray-700"
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {author.name}
                    </span>
                    {idx < post.authors.length - 1 && <span className="text-gray-500">,</span>}
                  </span>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {coverImageUrl && (
        <div className="w-full flex justify-center rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900">
          <img
            src={coverImageUrl}
            alt={post.title}
            className="w-full h-auto max-w-2xl"
            style={{ 
              maxWidth: '100%', 
              height: 'auto',
              maxHeight: isCoverVertical ? '600px' : '500px',
              objectFit: 'contain'
            }}
            loading="eager"
            decoding="async"
          />
        </div>
      )}

      {post.content && (
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <PortableText value={post.content} components={portableTextComponents} />
        </div>
      )}
      </article>
    </>
  )
}

