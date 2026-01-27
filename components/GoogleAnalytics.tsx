'use client'

import { useEffect } from 'react'

export default function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  useEffect(() => {
    if (!gaId || typeof window === 'undefined') return

    // Load gtag script
    const script1 = document.createElement('script')
    script1.async = true
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
    document.head.appendChild(script1)

    // Initialize gtag
    window.dataLayer = window.dataLayer || []
    function gtag(...args: any[]) {
      window.dataLayer.push(args)
    }
    ;(window as any).gtag = gtag
    gtag('js', new Date())
    gtag('config', gaId, {
      page_path: window.location.pathname,
    })

    return () => {
      // Cleanup on unmount
      const scripts = document.querySelectorAll(`script[src*="googletagmanager"]`)
      scripts.forEach(script => script.remove())
    }
  }, [gaId])

  return null
}
