import { describe, it, expect } from 'vitest'

function getChapter(p: number): number {
  return p < 0.34 ? 0 : p < 0.67 ? 1 : 2
}

describe('HeroSection chapter logic', () => {
  it('returns chapter 0 at 0% progress', () => {
    expect(getChapter(0)).toBe(0)
  })
  it('returns chapter 0 just below 34%', () => {
    expect(getChapter(0.339)).toBe(0)
  })
  it('returns chapter 1 at 34%', () => {
    expect(getChapter(0.34)).toBe(1)
  })
  it('returns chapter 2 at 67%', () => {
    expect(getChapter(0.67)).toBe(2)
  })
  it('returns chapter 2 at 100%', () => {
    expect(getChapter(1)).toBe(2)
  })
})
