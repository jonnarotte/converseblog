import { posts } from "@/content/posts"
import BlogCard from "@/components/BlogCard"

export default function BlogPage() {
  return (
    <section className="space-y-10">
      <h1 className="text-4xl font-bold">Converze Blog</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {posts.map(post => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  )
}

