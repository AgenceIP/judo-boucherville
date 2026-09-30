import { describe, it, expect } from 'vitest'
import { slugify } from '../slug'

describe('slugify', () => {
  it.each([
    ['Édouard Chassé', 'edouard-chasse'],
    ['Jérome Lajoie et Jacob St-Jean', 'jerome-lajoie-et-jacob-st-jean'],
    ['  Judo — enfants (5-6 ans)  ', 'judo-enfants-5-6-ans'],
    ['Fayçal Bousbiat', 'faycal-bousbiat'],
  ])('%s → %s', (s, slug) => expect(slugify(s)).toBe(slug))

  it('stays under 96 characters without a trailing dash', () => {
    const s = slugify('Championnat provincial '.repeat(10))
    expect(s.length).toBeLessThanOrEqual(96)
    expect(s).not.toMatch(/-$/)
  })
})
