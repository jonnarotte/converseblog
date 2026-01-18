import { notFound } from "next/navigation"
import Image from "next/image"
import { PortableText } from "@portabletext/react"
import { urlFor } from "@/sanity/lib/image"
import { getAllPostSlugs, getPostBySlug } from "@/sanity/lib/queries"

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs()
  return slugs.map((item: { slug: string }) => ({
    slug: item.slug,
  }))
}

const components = {
  types: {
    image: ({ value }: any) => (
      <Image
        src={urlFor(value).width(800).url()}
        alt=""
        width={800}
        height={400}
        className="rounded-lg"
      />
    ),
  },
}

export default async function BlogPost({
  params,
}: {
  params: { slug: string }
}) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold">{post.title}</h1>

      {post.excerpt && (
        <p className="text-xl text-gray-500">{post.excerpt}</p>
      )}

      {post.coverImage && (
        <Image
          src={urlFor(post.coverImage).width(1200).height(600).url()}
          alt={post.title}
          width={1200}
          height={600}
          className="rounded-lg"
        />
      )}

      <div className="prose prose-lg">
        <PortableText value={post.body} components={components} />
      </div>
    </article>
  )
}

