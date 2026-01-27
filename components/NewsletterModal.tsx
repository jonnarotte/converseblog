'use client'

import { useEffect, useState } from 'react'
import Newsletter from './Newsletter'

export default function NewsletterModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasShown, setHasShown] = useState(false)

  useEffect(() => {
    // Check if user has already dismissed the modal
    const dismissed = localStorage.getItem('newsletterModalDismissed')
    if (dismissed === 'true') {
      return
    }

    // Check if user has already subscribed
    const subscribed = localStorage.getItem('newsletterSubscribed')
    if (subscribed === 'true') {
      return
    }

    // Show modal after delay (30 seconds) or on scroll (after 50% scroll)
    let timeoutId: NodeJS.Timeout
    let scrollTimeoutId: NodeJS.Timeout

    const showModal = () => {
      if (!hasShown) {
        setIsOpen(true)
        setHasShown(true)
      }
    }

    // Show after 30 seconds
    timeoutId = setTimeout(showModal, 30000)

    // Show when user scrolls 50% down the page
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      
      if (scrollPercent >= 50 && !hasShown) {
        clearTimeout(timeoutId)
        clearTimeout(scrollTimeoutId)
        scrollTimeoutId = setTimeout(showModal, 2000) // Wait 2 seconds after reaching 50%
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      clearTimeout(timeoutId)
      clearTimeout(scrollTimeoutId)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [hasShown])

  const handleClose = () => {
    setIsOpen(false)
    localStorage.setItem('newsletterModalDismissed', 'true')
  }

  const handleSuccess = () => {
    // Mark as subscribed so modal won't show again
    localStorage.setItem('newsletterSubscribed', 'true')
    setTimeout(() => {
      setIsOpen(false)
    }, 2000) // Close after showing success message
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="newsletter-modal-title"
      >
        <div
          className="relative bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg shadow-xl max-w-md w-full p-6 animate-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Content */}
          <div className="space-y-4">
            <div>
              <h2 id="newsletter-modal-title" className="text-2xl font-medium mb-2">
                Stay Updated
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get notified when we publish new blog posts about voice analysis, communication, and personal development.
              </p>
            </div>

            <NewsletterModalForm onSuccess={handleSuccess} source="modal" />
          </div>
        </div>
      </div>
    </>
  )
}

// Separate form component to handle subscription
function NewsletterModalForm({ onSuccess, source }: { onSuccess: () => void; source: string }) {
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
        localStorage.setItem('newsletterSubscribed', 'true')
        setTimeout(() => {
          onSuccess()
        }, 2000)
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

  if (status === 'success') {
    return (
      <div className="text-center py-4">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-green-600 dark:text-green-400 font-medium">{message}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          disabled={status === 'loading'}
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {status === 'loading' ? '...' : 'Subscribe'}
        </button>
      </div>
      {message && status === 'error' && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {message}
        </p>
      )}
      <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
        No spam. Unsubscribe anytime.
      </p>
    </form>
  )
}
