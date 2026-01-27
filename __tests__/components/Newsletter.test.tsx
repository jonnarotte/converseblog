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
    render(<Newsletter source="test" />)
    
    const input = screen.getByPlaceholderText(/enter your email/i)
    expect(input).toBeInTheDocument()
    
    const button = screen.getByRole('button', { name: /subscribe/i })
    expect(button).toBeInTheDocument()
  })

  it('validates email format', async () => {
    const user = userEvent.setup()
    render(<Newsletter source="test" />)
    
    const input = screen.getByPlaceholderText(/enter your email/i)
    const button = screen.getByRole('button', { name: /subscribe/i })
    
    // Enter invalid email
    await user.type(input, 'invalid-email')
    await user.click(button)
    
    // Should show validation error
    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
    })
  })

  it('submits valid email', async () => {
    const user = userEvent.setup()
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    })

    render(<Newsletter source="test" />)
    
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
