import { getAboutContent, PortableText } from "@/lib/sanity"
import { portableTextComponents } from "@/components/PortableTextComponents"
import type { Metadata } from 'next'

export const revalidate = 300 // Revalidate every 5 minutes
export const dynamic = 'force-static' // Force static generation

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Converze - a self-reflection app designed to help people understand how they sound and transform their communication through voice visualization.',
  alternates: {
    canonical: `${siteUrl}/about`,
  },
  openGraph: {
    title: 'About | Converze',
    description: 'Learn about Converze - a self-reflection app designed to help people understand how they sound.',
    url: `${siteUrl}/about`,
  },
}

export default async function About() {
  const about = await getAboutContent()

  if (!about) {
    return (
      <section className="max-w-3xl mx-auto space-y-6 w-full overflow-x-hidden">
        <h1 className="text-4xl font-medium">About Converze</h1>
        <p>
          Converze is a self-reflection app designed to help people understand how
          they sound — not just what they say.
        </p>
        <p>
          By turning speech into visual shapes and patterns, Converze helps users
          build awareness and intentionally transform their communication style.
        </p>
        <p className="font-medium">
          Awareness comes before change.
        </p>
      </section>
    )
  }

  return (
    <section className="max-w-3xl mx-auto space-y-6 w-full overflow-x-hidden">
      <h1 className="text-4xl font-medium">{about.title || 'About Converze'}</h1>
      {about.content && (
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <PortableText value={about.content} components={portableTextComponents} />
        </div>
      )}
    </section>
  )
}

