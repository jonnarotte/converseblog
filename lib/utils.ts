// Utility functions for the application

/**
 * Calculate reading time in minutes based on word count
 */
export function calculateReadingTime(content: any[]): number {
  if (!content || !Array.isArray(content)) return 1
  
  let wordCount = 0
  
  for (const block of content) {
    if (block._type === 'block' && block.children) {
      for (const child of block.children) {
        if (child.text) {
          wordCount += child.text.split(/\s+/).length
        }
      }
    }
  }
  
  // Average reading speed: 200 words per minute
  const readingTime = Math.ceil(wordCount / 200)
  return readingTime < 1 ? 1 : readingTime
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

/**
 * Extract plain text from Portable Text content
 */
export function extractPlainText(content: any[]): string {
  if (!content || !Array.isArray(content)) return ''
  
  let text = ''
  
  for (const block of content) {
    if (block._type === 'block' && block.children) {
      for (const child of block.children) {
        if (child.text) {
          text += child.text + ' '
        }
      }
    }
  }
  
  return text.trim()
}

/**
 * Generate slug from string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Get excerpt from content
 */
export function getExcerpt(content: any[], maxLength: number = 160): string {
  const text = extractPlainText(content)
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}
