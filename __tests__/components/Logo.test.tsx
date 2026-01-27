import { render } from '@testing-library/react'
import Logo from '@/components/Logo'

describe('Logo Component', () => {
  it('renders icon variant by default', () => {
    const { container } = render(<Logo />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg?.getAttribute('viewBox')).toBe('0 0 64 64')
  })

  it('renders full variant with text', () => {
    const { container } = render(<Logo variant="full" />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg?.getAttribute('viewBox')).toBe('0 0 120 40')
  })

  it('applies custom className', () => {
    const { container } = render(<Logo className="custom-class" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('custom-class')
  })

  it('respects size prop', () => {
    const { container } = render(<Logo size={40} />)
    const svg = container.querySelector('svg')
    expect(svg?.style.width).toBe('40px')
    expect(svg?.style.height).toBe('40px')
  })
})
