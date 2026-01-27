'use client'

import { useEffect, useRef, useState } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  opacity: number
}

// Detect low-end devices
function isLowEndDevice(): boolean {
  if (typeof window === 'undefined') return false
  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true
  // Check hardware concurrency (CPU cores)
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) return true
  // Check device memory (if available)
  if ('deviceMemory' in navigator && (navigator as any).deviceMemory < 4) return true
  return false
}

export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const animationFrameRef = useRef<number | undefined>(undefined)
  const [isHovered, setIsHovered] = useState(false)
  const [isLowEnd, setIsLowEnd] = useState(false)
  const lastFrameTime = useRef(0)
  const frameSkip = useRef(0)

  useEffect(() => {
    const lowEnd = isLowEndDevice()
    setIsLowEnd(lowEnd)
    
    // Disable on low-end devices
    if (lowEnd) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    
    const resizeHandler = () => {
      resizeCanvas()
      // Recreate particles on resize for better distribution
      const particleCount = Math.min(40, Math.floor((canvas.width * canvas.height) / 15000))
      createParticles(particleCount)
    }
    window.addEventListener('resize', resizeHandler, { passive: true })

    // Optimized particle creation
    const createParticles = (count: number) => {
      const colors = [
        'rgba(59, 130, 246, 0.4)', // blue-500 (reduced opacity)
        'rgba(99, 102, 241, 0.3)', // indigo-500
      ]

      particlesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3, // Reduced velocity
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1, // Smaller particles
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.3 + 0.2, // Lower opacity
      }))
    }

    // Reduced particle count for performance
    const particleCount = Math.min(40, Math.floor((canvas.width * canvas.height) / 15000))
    createParticles(particleCount)

    // Throttled mouse tracking (performance optimization)
    let mouseThrottle = 0
    const handleMouseMove = (e: MouseEvent) => {
      mouseThrottle++
      if (mouseThrottle % 2 === 0) return // Skip every other frame
      
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
      }
      setIsHovered(true)
    }

    const handleMouseLeave = () => {
      setIsHovered(false)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true })

    // Optimized animation loop with frame skipping for low-end devices
    const animate = (currentTime: number) => {
      // Frame skipping for performance (target 30fps on low-end, 60fps on high-end)
      frameSkip.current++
      if (frameSkip.current % 2 === 0 && isLowEnd) {
        animationFrameRef.current = requestAnimationFrame(animate)
        return
      }

      const deltaTime = currentTime - lastFrameTime.current
      if (deltaTime < 16) { // Cap at ~60fps
        animationFrameRef.current = requestAnimationFrame(animate)
        return
      }
      lastFrameTime.current = currentTime

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const particles = particlesRef.current
      const mouse = mouseRef.current

      // Optimized particle update (batch operations)
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i]
        
        // Mouse interaction (reduced frequency)
        if (isHovered && frameSkip.current % 3 === 0) {
          const dx = mouse.x - particle.x
          const dy = mouse.y - particle.y
          const distanceSq = dx * dx + dy * dy // Skip sqrt for performance
          const maxDistanceSq = 10000 // 100^2

          if (distanceSq < maxDistanceSq) {
            const distance = Math.sqrt(distanceSq)
            const force = (100 - distance) / 100
            const angle = Math.atan2(dy, dx)
            particle.vx -= Math.cos(angle) * force * 0.015 // Reduced force
            particle.vy -= Math.sin(angle) * force * 0.015
          }
        }

        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -0.9
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -0.9

        // Keep particles in bounds
        particle.x = Math.max(0, Math.min(canvas.width, particle.x))
        particle.y = Math.max(0, Math.min(canvas.height, particle.y))

        // Friction
        particle.vx *= 0.99
        particle.vy *= 0.99

        // Draw particle (optimized)
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()

        // Draw connections (reduced frequency and distance)
        for (let j = i + 1; j < particles.length; j++) {
          const otherParticle = particles[j]
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distanceSq = dx * dx + dy * dy

          if (distanceSq < 6400) { // 80^2 (reduced from 120)
            const distance = Math.sqrt(distanceSq)
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.strokeStyle = `rgba(59, 130, 246, ${(1 - distance / 80) * 0.15})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      // Mouse cursor effect (reduced opacity)
      if (isHovered && frameSkip.current % 2 === 0) {
        const gradient = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          80 // Reduced radius
        )
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.05)')
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0)')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resizeHandler)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isHovered, isLowEnd])

  // Don't render on low-end devices
  if (isLowEnd) {
    return null
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ background: 'transparent' }}
    />
  )
}
