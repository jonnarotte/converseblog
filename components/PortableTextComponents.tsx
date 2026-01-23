import { urlFor } from '@/sanity/lib/image'
import type { PortableTextComponents } from '@portabletext/react'

export const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      // Check if asset exists - it might be a reference or direct object
      if (!value?.asset) {
        console.warn('Image missing asset:', value)
        return null
      }
      
      try {
        // Get image dimensions from asset metadata if available
        const dimensions = value.asset?.metadata?.dimensions
        const width = dimensions?.width || 1200
        const height = dimensions?.height || 800
        const aspectRatio = width / height
        const isVertical = aspectRatio < 1 // Height > Width
        
        // Don't constrain the image URL - let it be full size
        const imageUrl = urlFor(value).url()
        const alt = value.alt || 'Blog post image'
        
        if (!imageUrl) {
          console.warn('Failed to generate image URL:', value)
          return null
        }
        
        return (
          <div className="my-8">
            <div className="flex justify-center">
              <div className="w-full max-w-2xl rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900">
              <img
                src={imageUrl}
                alt={alt}
                className="w-full h-auto"
                style={{ 
                  maxWidth: '100%', 
                  height: 'auto',
                  maxHeight: isVertical ? '600px' : 'none',
                  objectFit: 'contain'
                }}
                loading="lazy"
                decoding="async"
              />
              </div>
            </div>
            {value.alt && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center italic max-w-2xl mx-auto">
                {value.alt}
              </p>
            )}
          </div>
        )
      } catch (error) {
        console.error('Error rendering image:', error, value)
        return null
      }
    },
  },
  block: {
    h1: ({ children }) => <h1 className="text-4xl font-bold mt-8 mb-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-3xl font-bold mt-6 mb-3">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl font-semibold mt-4 mb-2">{children}</h3>,
    h4: ({ children }) => <h4 className="text-xl font-semibold mt-3 mb-2">{children}</h4>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 my-4 italic text-gray-700 dark:text-gray-300">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc list-inside my-4 space-y-2">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal list-inside my-4 space-y-2">{children}</ol>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    ),
  },
}
