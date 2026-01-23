import { groq } from 'next-sanity'

export const postsQuery = groq`*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  coverImage {
    asset->{
      _id,
      url,
      metadata {
        dimensions
      }
    }
  },
  "authors": authors[]->{
    _id,
    name,
    slug,
    image,
    socialLink
  }
}`

export const postBySlugQuery = groq`*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  coverImage {
    asset->{
      _id,
      url,
      metadata {
        dimensions
      }
    }
  },
  // Use content if available, fallback to body for legacy content
  // Expand image assets in content
  "content": coalesce(content, body)[]{
    ...,
    _type == "image" => {
      ...,
      asset->{
        _id,
        url,
        metadata {
          dimensions
        }
      }
    }
  },
  "authors": authors[]->{
    _id,
    name,
    slug,
    image,
    bio,
    socialLink
  }
}`

export const postSlugsQuery = groq`*[_type == "post" && defined(slug.current)] {
  "slug": slug.current
}`

export const aboutQuery = groq`*[_type == "about"][0] {
  title,
  content
}`

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0] {
  organizationName,
  description,
  email,
  socialLinks,
  appLinks,
  legalLinks
}`
