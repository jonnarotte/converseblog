'use client'

import { useEffect, useState } from 'react'
import dynamicImport from 'next/dynamic'
import config from '../../../sanity.config'
import '../studio-styles.css'

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
    
    // Completely isolate Studio from global CSS
    const style = document.createElement('style')
    style.textContent = `
      /* Force Studio isolation */
      html:has([data-sanity="studio-layout"]),
      body:has([data-sanity="studio-layout"]) {
        overflow: hidden !important;
        margin: 0 !important;
        padding: 0 !important;
        position: fixed !important;
        width: 100vw !important;
        height: 100vh !important;
      }
      
      [data-sanity="studio-layout"] {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        overflow: visible !important;
        z-index: 99999 !important;
      }
      
      [data-sanity="studio-layout"] * {
        overflow: visible !important;
        max-width: none !important;
        max-height: none !important;
      }
    `
    document.head.appendChild(style)
    
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
      document.head.removeChild(style)
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
    <div suppressHydrationWarning data-sanity="studio-page" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
      <NextStudio config={config} />
    </div>
  )
}
