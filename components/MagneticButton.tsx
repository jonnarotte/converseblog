'use client'

import { useRef, useState, useEffect } from 'react'

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  strength?: number
  onClick?: () => void
}

// Throttle function
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

export default function MagneticButton({
  children,
  className = '',
  strength = 0.2, // Reduced default strength
  onClick,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const button = buttonRef.current
    if (!button) return

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const handleMouseMove = throttle((e: MouseEvent) => {
      const rect = button.getBoundingClientRect()
      const x = e.clientX - (rect.left + rect.width / 2)
      const y = e.clientY - (rect.top + rect.height / 2)

      setPosition({
        x: x * strength,
        y: y * strength,
      })
    }, 16) // ~60fps

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 })
    }

    button.addEventListener('mousemove', handleMouseMove, { passive: true })
    button.addEventListener('mouseleave', handleMouseLeave, { passive: true })

    return () => {
      button.removeEventListener('mousemove', handleMouseMove)
      button.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [strength])

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className={`transition-transform duration-300 ease-out ${className}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      {children}
    </button>
  )
}
