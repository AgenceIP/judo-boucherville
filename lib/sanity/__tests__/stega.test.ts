import { describe, expect, it } from 'vitest'
import { stegaFilter } from '../stega'

type Path = (string | number | { _key: string; _index: number })[]
const marque = (sourcePath: Path, value: string, filterDefault = () => true) =>
  stegaFilter({ sourcePath, resultPath: sourcePath, value, sourceDocument: { _id: 'x', _type: 'programme' }, filterDefault })

describe('stegaFilter', () => {
  it('marks text Fayçal edits', () => {
    expect(marque(['titre'], 'Judo enfants')).toBe(true)
    expect(marque(['groupes', { _key: 'a', _index: 0 }, 'notes'], 'Apporter une bouteille d’eau')).toBe(true)
  })
  it('leaves parsed and compared fields clean', () => {
    expect(marque(['groupes', { _key: 'a', _index: 0 }, 'horaire'], 'Samedi 09h00 à 10h00')).toBe(false)
    expect(marque(['groupes', { _key: 'a', _index: 0 }, 'clientele'], '5 à 7 ans')).toBe(false)
    expect(marque(['groupes', { _key: 'a', _index: 0 }, 'code'], 'JE1')).toBe(false)
    expect(marque(['slug', 'current'], 'judo-enfants')).toBe(false)
    expect(marque(['inscription', 'saison'], '2026-2027')).toBe(false)
    expect(marque(['colonnes', 0], 'Avant le 19 août')).toBe(false)
    expect(marque(['categorie'], 'enfants')).toBe(false)
    expect(marque(['equipes', 0], 'u16')).toBe(false)
    expect(marque(['debut'], '2026-08-30')).toBe(false)
  })
  it('leaves links, emails and phone numbers clean', () => {
    expect(marque(['tel'], '450 655-1888')).toBe(false)
    expect(marque(['courriel'], 'info@judoboucherville.com')).toBe(false)
    expect(marque(['formulaire'], 'https://example.com/inscription.pdf')).toBe(false)
    expect(marque(['texte'], '/fr/inscription')).toBe(false)
  })
  it('defers everything else to the default filter', () => {
    expect(marque(['titre'], 'Judo enfants', () => false)).toBe(false)
  })
})
