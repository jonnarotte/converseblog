'use client'

import { useEffect, useState } from 'react'

export default function ComicConEffect() {
  const [isVisible, setIsVisible] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    // Show effect after page load
    const timer = setTimeout(() => setIsVisible(true), 1000)

    // Show effects on scroll
    const handleScroll = () => {
      if (!hasScrolled && window.scrollY > 100) {
        setHasScrolled(true)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [hasScrolled])

  // Don't show on mobile/low-end devices for performance
  if (typeof window !== 'undefined') {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return null
  }

  if (!isVisible) return null

  return (
    <>
      {/* Comic-style speech bubbles - lightweight CSS animations */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {/* Animated speech bubbles - only show on desktop */}
        <div className="hidden md:block">
          <div 
            className="absolute top-20 left-10"
            style={{
              animation: 'fadeInUp 1s ease-out 1s forwards',
              opacity: 0,
            }}
          >
            <div className="relative bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium">
              <span>🎤 Voice Visualization</span>
              <div className="absolute -bottom-2 left-4 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-blue-500"></div>
            </div>
          </div>

          <div 
            className="absolute top-40 right-10"
            style={{
              animation: 'fadeInUp 1s ease-out 2s forwards',
              opacity: 0,
            }}
          >
            <div className="relative bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium">
              <span>✨ Transform Communication</span>
              <div className="absolute -bottom-2 right-4 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-indigo-500"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Comic-style onomatopoeia - appears on scroll */}
      {hasScrolled && (
        <div className="fixed inset-0 pointer-events-none z-40">
          <div 
            className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              animation: 'fadeInScale 1s ease-out forwards',
              opacity: 0,
            }}
          >
            <div className="text-5xl md:text-6xl font-black text-blue-500/20 dark:text-blue-400/10 select-none transform rotate-12">
              POW!
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.5) rotate(12deg) translate(-50%, -50%);
          }
          to {
            opacity: 1;
            transform: scale(1) rotate(12deg) translate(-50%, -50%);
          }
        }
      `}</style>
    </>
  )
}
