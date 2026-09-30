import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import PageHeroView from '../PageHeroView'
import { PHOTO_KEYS, type PhotosSite } from '@/lib/content/types'

const photos = Object.fromEntries(PHOTO_KEYS.map(k => [k, { src: `/${k}.jpg`, w: 1600, h: 1000, pos: '30% 70%', alt: k, altEn: k }])) as PhotosSite

describe('PageHero', () => {
  it('renders title', () => {
    render(<PageHeroView photos={photos} title="Test Title" />)
    // the title is split into words for its masked reveal, so match on its accessible name
    expect(screen.getByRole('heading', { level: 1, name: 'Test Title' })).toBeInTheDocument()
  })
  it('renders subtitle when provided', () => {
    render(<PageHeroView photos={photos} title="Title" subtitle="Subtitle text" />)
    expect(screen.getByText('Subtitle text')).toBeInTheDocument()
  })
  it('renders tag when provided', () => {
    render(<PageHeroView photos={photos} title="Title" tag="Enfants" />)
    expect(screen.getByText('Enfants')).toBeInTheDocument()
  })
  it('uses the photo and focal point set in the Studio', () => {
    const { container } = render(<PageHeroView photos={photos} title="Test Title" />)
    const img = container.querySelector('img')!
    expect(img.getAttribute('src')).toContain('valeursRespect.jpg')
    expect(img.style.objectPosition).toBe('30% 70%')
  })
})
