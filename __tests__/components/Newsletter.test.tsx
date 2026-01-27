import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Newsletter from '@/components/Newsletter'

// Mock fetch for API calls
global.fetch = jest.fn()

describe('Newsletter Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders newsletter form', () => {
    render(<Newsletter source="other" />)
    
    const input = screen.getByPlaceholderText(/enter your email/i)
    expect(input).toBeInTheDocument()
    
    const button = screen.getByRole('button', { name: /subscribe/i })
    expect(button).toBeInTheDocument()
  })

  it('validates email format via HTML5', async () => {
    const user = userEvent.setup()
    render(<Newsletter source="other" />)
    
    const input = screen.getByPlaceholderText(/enter your email/i) as HTMLInputElement
    
    // HTML5 email validation - browser handles it
    // Check that input has email type and required attribute
    expect(input.type).toBe('email')
    expect(input.required).toBe(true)
    
    // Try to submit invalid email
    await user.type(input, 'invalid-email')
    
    // HTML5 validation prevents form submission
    // The form won't submit, so no error message is shown
    // This is expected browser behavior
  })

  it('submits valid email', async () => {
    const user = userEvent.setup()
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    })

    render(<Newsletter source="other" />)
    
    const input = screen.getByPlaceholderText(/enter your email/i)
    const button = screen.getByRole('button', { name: /subscribe/i })
    
    await user.type(input, 'test@example.com')
    await user.click(button)
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/newsletter'),
        expect.objectContaining({
          method: 'POST',
        })
      )
    })
  })
})
