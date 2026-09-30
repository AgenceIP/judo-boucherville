import { describe, it, expect } from 'vitest'
import { debutSaison, saisonCourante, saisonValide } from '../saison'

describe('saisonCourante', () => {
  it('switches on August 1', () => {
    expect(saisonCourante(new Date(2026, 6, 31))).toBe('2025-2026')
    expect(saisonCourante(new Date(2026, 7, 1))).toBe('2026-2027')
    expect(saisonCourante(new Date(2027, 0, 15))).toBe('2026-2027')
  })
})

it('debutSaison', () => expect(debutSaison('2026-2027')).toBe('2026-08-01'))

it('saisonValide', () => {
  expect(saisonValide('2026-2027')).toBe(true)
  for (const s of ['2026-2028', '2026', '2026–2027']) expect(saisonValide(s)).toBe(false)
})
