'use client'

import { useEffect, useState } from 'react'
import dynamicImport from 'next/dynamic'
import config from '../../../sanity.config'

// Disable SSR for Studio to avoid hydration issues with Sanity's internal components
const NextStudio = dynamicImport(
  () => import('next-sanity/studio').then((mod) => mod.NextStudio),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading Studio...</p>
        </div>
      </div>
    ),
  }
)

export default function StudioPage() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Suppress hydration warnings for Sanity Studio
    const originalError = console.error
    console.error = (...args: any[]) => {
      if (
        typeof args[0] === 'string' &&
        (args[0].includes('hydration') || 
         args[0].includes('cannot be a descendant') ||
         args[0].includes('cannot contain a nested'))
      ) {
        // Suppress hydration warnings from Sanity Studio
        return
      }
      originalError.apply(console, args)
    }
    
    return () => {
      console.error = originalError
    }
  }, [])

  // Only render Studio after client-side mount to prevent hydration errors
  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading Studio...</p>
        </div>
      </div>
    )
  }

  return (
    <div suppressHydrationWarning>
      <NextStudio config={config} />
    </div>
  )
}
