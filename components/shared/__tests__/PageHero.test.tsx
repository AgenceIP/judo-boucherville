import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import PageHero from '../PageHero'

describe('PageHero', () => {
  it('renders title', () => {
    render(<PageHero title="Test Title" />)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })
  it('renders subtitle when provided', () => {
    render(<PageHero title="Title" subtitle="Subtitle text" />)
    expect(screen.getByText('Subtitle text')).toBeInTheDocument()
  })
  it('renders tag when provided', () => {
    render(<PageHero title="Title" tag="Enfants" />)
    expect(screen.getByText('Enfants')).toBeInTheDocument()
  })
})
