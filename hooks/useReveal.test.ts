import { describe, it, expect } from 'vitest'

describe('useReveal', () => {
  it('exports a function', async () => {
    const { useReveal } = await import('./useReveal')
    expect(typeof useReveal).toBe('function')
  })
})
