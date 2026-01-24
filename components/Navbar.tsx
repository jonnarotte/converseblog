import Link from "next/link"
import ThemeToggle from "./ThemeToggle"
import Logo from "./Logo"

export default function Navbar() {
  return (
    <nav 
      className="border-b border-gray-300 dark:border-gray-700 w-full"
      style={{ 
        position: 'static',
        top: 'auto',
        left: 'auto',
        right: 'auto',
        bottom: 'auto',
        zIndex: 'auto'
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center w-full min-w-0 gap-4">
        <Link href="/" className="font-medium text-lg hover:opacity-80 transition-opacity flex items-center gap-2 flex-shrink-0" prefetch={true} style={{ minWidth: 0 }}>
          <div className="flex-shrink-0 w-7 h-7 flex items-center justify-center overflow-hidden">
            <Logo size={28} className="text-black dark:text-white" />
          </div>
          <span className="whitespace-nowrap">Converze</span>
        </Link>
        <div className="flex items-center gap-6 flex-shrink-0">
          <Link 
            href="/blog" 
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
            prefetch={true}
          >
            Blog
          </Link>
          <Link 
            href="/about" 
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
            prefetch={true}
          >
            About
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}

