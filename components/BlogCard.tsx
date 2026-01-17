import Link from "next/link"

export default function BlogCard({ post }: any) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="block border p-6 rounded-xl hover:border-black transition"
    >
      <h2 className="text-xl font-semibold">{post.title}</h2>
      <p className="text-gray-600 mt-2">{post.excerpt}</p>
    </Link>
  )
}

