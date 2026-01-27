'use client'

import { useState } from 'react'

interface NewsletterProps {
  source?: 'home' | 'blog' | 'post' | 'other'
}

export default function Newsletter({ source = 'other' }: NewsletterProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')
    
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, source }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        if (data.alreadySubscribed) {
          setMessage('You are already subscribed!')
        } else if (data.resubscribed) {
          setMessage('Welcome back! You\'ve been resubscribed.')
        } else {
          setMessage('Thanks for subscribing!')
        }
        setEmail('')
        setTimeout(() => {
          setStatus('idle')
          setMessage('')
        }, 5000)
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong. Please try again.')
        setTimeout(() => {
          setStatus('idle')
          setMessage('')
        }, 5000)
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error)
      setStatus('error')
      setMessage('Network error. Please check your connection and try again.')
      setTimeout(() => {
        setStatus('idle')
        setMessage('')
      }, 5000)
    }
  }

  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-900">
      <h3 className="font-medium mb-2">Subscribe to our newsletter</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Get notified when we publish new blog posts.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          disabled={status === 'loading'}
          className="flex-1 px-3 py-1.5 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-3 py-1.5 bg-blue-600 dark:bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 whitespace-nowrap flex-shrink-0"
        >
          {status === 'loading' ? 'Subscribing...' : status === 'success' ? '✓' : 'Subscribe'}
        </button>
      </form>
      {message && (
        <p className={`text-sm mt-2 ${
          status === 'success' 
            ? 'text-green-600 dark:text-green-400' 
            : 'text-red-600 dark:text-red-400'
        }`}>
          {message}
        </p>
      )}
    </div>
  )
}
