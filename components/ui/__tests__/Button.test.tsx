import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Button from '../Button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
  it('applies variant classes', () => {
    render(<Button variant="outline">Outline</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('border')
  })
  it('renders as anchor when href is provided', () => {
    render(<Button href="/test">Link</Button>)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/test')
  })
})
