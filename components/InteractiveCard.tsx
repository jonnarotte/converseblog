'use client'

import { useRef, useState, useEffect } from 'react'

interface InteractiveCardProps {
  children: React.ReactNode
  className?: string
}

// Throttle function for performance
function throttle<T extends (...args: any[]) => any>(func: T, limit: number): T {
  let inThrottle: boolean
  return ((...args: any[]) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }) as T
}

export default function InteractiveCard({ children, className = '' }: InteractiveCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 })
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const handleMouseMove = throttle((e: MouseEvent) => {
      if (!card) return

      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const centerX = rect.width / 2
      const centerY = rect.height / 2

      // Reduced rotation for performance
      const rotateX = ((y - centerY) / centerY) * -8
      const rotateY = ((x - centerX) / centerX) * 8

      setTransform({ rotateX, rotateY })
    }, 16) // ~60fps throttle

    const handleMouseEnter = () => {
      setIsHovered(true)
    }

    const handleMouseLeave = () => {
      setIsHovered(false)
      setTransform({ rotateX: 0, rotateY: 0 })
    }

    card.addEventListener('mousemove', handleMouseMove, { passive: true })
    card.addEventListener('mouseenter', handleMouseEnter, { passive: true })
    card.addEventListener('mouseleave', handleMouseLeave, { passive: true })

    return () => {
      card.removeEventListener('mousemove', handleMouseMove)
      card.removeEventListener('mouseenter', handleMouseEnter)
      card.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <div
      ref={cardRef}
      className={`transition-transform duration-300 ease-out ${className}`}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale(1.02)`
          : 'perspective(1000px) rotateX(0) rotateY(0) scale(1)',
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </div>
  )
}
