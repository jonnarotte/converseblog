import { sendEmail, createBlogPostEmail, createCustomEmail, createOrUpdateContact, getContact, listContacts, removeContact } from '@/lib/email'

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

  describe('createOrUpdateContact', () => {
    it('creates new contact successfully', async () => {
      const mockResponse = {
        id: 'contact-id',
        email: 'test@example.com',
        unsubscribed: false,
        created_at: new Date().toISOString(),
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => mockResponse,
      })

      const result = await createOrUpdateContact('test@example.com', {
        firstName: 'Test',
        lastName: 'User',
        unsubscribed: false,
      })

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/contacts'),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('test@example.com'),
        })
      )
      expect(result).toEqual(mockResponse)
    })

    it('updates existing contact on 409 conflict', async () => {
      const mockError = new Error('Contact already exists')
      mockError.message = 'already exists'
      
      const mockUpdateResponse = {
        id: 'contact-id',
        email: 'test@example.com',
        unsubscribed: false,
      }

      ;(global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: false,
          status: 409,
          json: async () => ({ error: { message: 'already exists' } }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockUpdateResponse,
        })

      const result = await createOrUpdateContact('test@example.com', {
        unsubscribed: false,
      })

      expect(global.fetch).toHaveBeenCalledTimes(2)
      expect(global.fetch).toHaveBeenLastCalledWith(
        expect.stringContaining('/contacts/test@example.com'),
        expect.objectContaining({
          method: 'PATCH',
        })
      )
      expect(result).toEqual(mockUpdateResponse)
    })
  })

  describe('getContact', () => {
    it('returns contact when found', async () => {
      const mockContact = {
        id: 'contact-id',
        email: 'test@example.com',
        unsubscribed: false,
        created_at: new Date().toISOString(),
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockContact,
      })

      const result = await getContact('test@example.com')

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/contacts/test@example.com'),
        expect.any(Object)
      )
      expect(result).toEqual(mockContact)
    })

    it('returns null when contact not found', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: { message: 'not found' } }),
      })

      const result = await getContact('test@example.com')

      expect(result).toBeNull()
    })
  })

  describe('listContacts', () => {
    it('lists contacts with default options', async () => {
      const mockResponse = {
        data: [
          { email: 'test1@example.com', unsubscribed: false },
          { email: 'test2@example.com', unsubscribed: false },
        ],
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await listContacts()

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/contacts'),
        expect.any(Object)
      )
      expect(result).toEqual(mockResponse)
    })

    it('lists contacts with limit option', async () => {
      const mockResponse = { data: [] }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      await listContacts({ limit: 100 })

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/contacts?limit=100'),
        expect.any(Object)
      )
    })

    it('lists contacts with audienceId option', async () => {
      const mockResponse = { data: [] }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      await listContacts({ audienceId: 'audience-123' })

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('audience_id=audience-123'),
        expect.any(Object)
      )
    })
  })

  describe('removeContact', () => {
    it('removes contact successfully', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })

      await removeContact('test@example.com')

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/contacts/test@example.com'),
        expect.objectContaining({
          method: 'DELETE',
        })
      )
    })
  })
})
