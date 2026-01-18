import { client } from './client'

export async function getAllPosts() {
  return client.fetch(`
    *[_type == "post"] | order(publishedAt desc) {
      title,
      "slug": slug.current,
      excerpt,
      publishedAt,
      coverImage
    }
  `)
}

export async function getPostBySlug(slug: string) {
  return client.fetch(
    `
    *[_type == "post" && slug.current == $slug][0] {
      title,
      excerpt,
      body,
      publishedAt,
      coverImage
    }
    `,
    { slug }
  )
}

export async function getAllPostSlugs() {
  return client.fetch(`
    *[_type == "post"] {
      "slug": slug.current
    }
  `)
}

