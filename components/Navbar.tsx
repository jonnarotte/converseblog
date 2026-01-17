import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="border-b">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between">
        <Link href="/" className="font-bold text-lg">
          Converze
        </Link>
        <div className="space-x-6">
          <Link href="/blog">Blog</Link>
          <Link href="/about">About</Link>
        </div>
      </div>
    </nav>
  )
}

