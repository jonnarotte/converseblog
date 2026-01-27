'use client'

import { useState, useEffect } from 'react'

interface Testimonial {
  quote: string
  author: string
  role: string
}

const testimonials: Testimonial[] = [
  {
    quote: "Converze helped me understand my communication style in ways I never imagined. The visual feedback is incredible.",
    author: "Sarah Chen",
    role: "Product Manager"
  },
  {
    quote: "I've become more confident in meetings. Seeing my voice patterns made me aware of habits I didn't know I had.",
    author: "Marcus Johnson",
    role: "Software Engineer"
  },
  {
    quote: "The daily practice feature keeps me engaged. It's like having a personal communication coach.",
    author: "Emily Rodriguez",
    role: "Marketing Director"
  }
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const current = testimonials[currentIndex]

  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-medium text-center">What People Are Saying</h2>
      
      <div className="max-w-2xl mx-auto">
        <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-8 bg-gray-50 dark:bg-gray-900 relative">
          <svg
            className="absolute top-4 left-4 w-8 h-8 text-blue-500/20"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.984zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          
          <blockquote className="text-lg text-gray-700 dark:text-gray-300 mb-6 relative z-10">
            "{current.quote}"
          </blockquote>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{current.author}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{current.role}</div>
            </div>
            
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-blue-600 dark:bg-blue-400 w-6'
                      : 'bg-gray-300 dark:bg-gray-700'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
