export interface Post {
  slug: string
  title: string
  excerpt: string
  content: string
  publishedAt?: string
  coverImage?: string
}

export const posts: Post[] = [
  {
    slug: "shape-of-your-voice",
    title: "Understanding the Shape of Your Voice",
    excerpt: "Your voice has structure, rhythm, and identity.",
    publishedAt: "2024-01-15",
    content: `
# Understanding the Shape of Your Voice

Your voice carries more than words.

It carries confidence, intent, and emotion.

Most people never truly understand how they sound.
Converze makes this visible.

## The Structure of Sound

Every voice has a unique structure. The way you pause, the rhythm you create, 
the tone you use—all of these elements combine to form your vocal identity.

## Making It Visible

Converze helps you see what you sound like. Not just hear it, but truly 
understand the patterns and structures that make your voice uniquely yours.
`,
  },
  {
    slug: "voice-patterns",
    title: "What Your Voice Pattern Says About You",
    excerpt: "Speech patterns reveal more than we realize.",
    publishedAt: "2024-01-10",
    content: `
# What Your Voice Pattern Says About You

Every voice has a pattern.

Rhythm, pauses, and tone influence perception.
Converze reflects these patterns without judgment.

## Patterns in Speech

The way you speak reveals more than you might think. Your pauses, your 
emphasis, your rhythm—all of these create a pattern that others perceive.

## Understanding Perception

How others hear you matters. Converze helps you understand how your voice 
patterns influence perception, giving you the tools to communicate more effectively.
`,
  },
]

export function getAllPosts(): Post[] {
  return posts.sort((a, b) => {
    const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
    const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
    return dateB - dateA
  })
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug)
}

export function getAllPostSlugs(): { slug: string }[] {
  return posts.map((post) => ({ slug: post.slug }))
}
