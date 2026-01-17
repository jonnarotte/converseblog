import { posts } from "@/content/posts"

export default function BlogPost({
  params,
}: {
  params: { slug: string }
}) {
  const post = posts.find(p => p.slug === params.slug)

  if (!post) {
    return <div className="p-10">Post not found</div>
  }

  return (
    <article className="max-w-3xl mx-auto prose prose-lg">
      <h1>{post.title}</h1>

      {post.content.split("\n").map((line, index) => (
        <p key={index}>{line}</p>
      ))}
    </article>
  )
}

