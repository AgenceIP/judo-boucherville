import { describe, it, expect } from 'vitest'
import { routing } from '../routing'

describe('routing', () => {
  it('has fr and en locales', () => {
    expect(routing.locales).toContain('fr')
    expect(routing.locales).toContain('en')
  })
  it('defaults to fr', () => {
    expect(routing.defaultLocale).toBe('fr')
  })
  it('has exactly 2 locales', () => {
    expect(routing.locales).toHaveLength(2)
  })
})
