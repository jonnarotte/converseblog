import BlogCard from "@/components/BlogCard"
import { getAllPosts } from "@/sanity/lib/queries"

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <section className="space-y-10">
      <h1 className="text-4xl font-bold">Converze Blog</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {posts.map((post: any) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  )
}

