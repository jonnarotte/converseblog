'use client'

import { useEffect, useState, useRef } from 'react'

interface Stat {
  value: number
  label: string
  suffix?: string
}

interface AnimatedStatsProps {
  stats: Stat[]
}

export default function AnimatedStats({ stats }: AnimatedStatsProps) {
  const [counts, setCounts] = useState(stats.map(() => 0))
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    const duration = 2000 // 2 seconds
    const steps = 60
    const stepDuration = duration / steps

    stats.forEach((stat, index) => {
      let currentStep = 0
      const increment = stat.value / steps

      const timer = setInterval(() => {
        currentStep++
        setCounts((prev) => {
          const newCounts = [...prev]
          newCounts[index] = Math.min(stat.value, increment * currentStep)
          return newCounts
        })

        if (currentStep >= steps) {
          clearInterval(timer)
        }
      }, stepDuration)
    })
  }, [isVisible, stats])

  return (
    <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className="text-4xl md:text-5xl font-medium mb-2 bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
            {Math.floor(counts[index])}{stat.suffix || '+'}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}
