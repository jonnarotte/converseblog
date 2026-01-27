import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchBar from '@/components/SearchBar'

const mockPosts = [
  {
    _id: '1',
    title: 'Test Post 1',
    slug: 'test-post-1',
    excerpt: 'This is a test post',
  },
  {
    _id: '2',
    title: 'Another Post',
    slug: 'another-post',
    excerpt: 'Another test post',
  },
]

describe('SearchBar Component', () => {
  it('renders search input', () => {
    render(<SearchBar posts={mockPosts} />)
    const input = screen.getByPlaceholderText('Search blog posts...')
    expect(input).toBeInTheDocument()
  })

  it('filters posts as user types', async () => {
    const user = userEvent.setup()
    render(<SearchBar posts={mockPosts} />)
    
    const input = screen.getByPlaceholderText('Search blog posts...')
    await user.type(input, 'Test')
    
    await waitFor(() => {
      expect(screen.getByText('Test Post 1')).toBeInTheDocument()
    })
  })

  it('shows no results for non-matching query', async () => {
    const user = userEvent.setup()
    render(<SearchBar posts={mockPosts} />)
    
    const input = screen.getByPlaceholderText('Search blog posts...')
    await user.type(input, 'NonExistent')
    
    await waitFor(() => {
      const results = screen.queryByText('Test Post 1')
      expect(results).not.toBeInTheDocument()
    })
  })

  it('closes dropdown when clicking outside', async () => {
    const user = userEvent.setup()
    render(<SearchBar posts={mockPosts} />)
    
    const input = screen.getByPlaceholderText('Search blog posts...')
    await user.type(input, 'Test')
    
    await waitFor(() => {
      expect(screen.getByText('Test Post 1')).toBeInTheDocument()
    })
    
    await user.click(document.body)
    
    await waitFor(() => {
      expect(screen.queryByText('Test Post 1')).not.toBeInTheDocument()
    })
  })
})
