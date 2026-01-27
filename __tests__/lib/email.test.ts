import { sendEmail, createBlogPostEmail, createCustomEmail } from '@/lib/email'

// Mock fetch globally
global.fetch = jest.fn()

describe('Email Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.RESEND_API_KEY = 'test-key'
    process.env.EMAIL_FROM = 'test@example.com'
  })

  describe('sendEmail', () => {
    it('sends email successfully', async () => {
      const mockResponse = {
        id: 'test-id',
        from: 'test@example.com',
        to: ['recipient@example.com'],
        created_at: new Date().toISOString(),
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await sendEmail({
        to: 'recipient@example.com',
        subject: 'Test Subject',
        html: '<p>Test HTML</p>',
      })

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.resend.com/emails',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-key',
          }),
        })
      )
      expect(result).toEqual(mockResponse)
    })

    it('throws error when API key is missing', async () => {
      delete process.env.RESEND_API_KEY
      
      // Suppress expected console.error
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      await expect(
        sendEmail({
          to: 'recipient@example.com',
          subject: 'Test',
          html: '<p>Test</p>',
        })
      ).rejects.toThrow('Email service not configured')
      
      consoleSpy.mockRestore()
    })

    it('handles API errors', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'API Error' }),
      })
      
      // Suppress expected console.error
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      await expect(
        sendEmail({
          to: 'recipient@example.com',
          subject: 'Test',
          html: '<p>Test</p>',
        })
      ).rejects.toThrow('Failed to send email')
      
      consoleSpy.mockRestore()
    })
  })

  describe('createBlogPostEmail', () => {
    it('creates email template with post data', () => {
      const post = {
        title: 'Test Post',
        excerpt: 'Test excerpt',
        slug: 'test-post',
        publishedAt: '2026-01-27',
        authors: [{ name: 'Test Author' }],
      }

      const html = createBlogPostEmail(post)
      
      expect(html).toContain('Test Post')
      expect(html).toContain('Test excerpt')
      expect(html).toContain('Test Author')
      expect(html).toContain('test-post')
    })

    it('handles missing optional fields', () => {
      const post = {
        title: 'Test Post',
        excerpt: 'Test excerpt',
        slug: 'test-post',
        publishedAt: '2026-01-27',
      }

      const html = createBlogPostEmail(post)
      expect(html).toContain('Test Post')
      expect(html).toContain('Converze Team') // Default author
    })
  })

  describe('createCustomEmail', () => {
    it('creates custom email template', () => {
      const html = createCustomEmail(
        'Test Subject',
        'Test message',
        'Click Here',
        'https://example.com'
      )

      expect(html).toContain('Test message')
      expect(html).toContain('Click Here')
      expect(html).toContain('https://example.com')
    })

    it('creates email without CTA', () => {
      const html = createCustomEmail('Test Subject', 'Test message')
      expect(html).toContain('Test message')
      expect(html).not.toContain('Click Here')
    })
  })
})
