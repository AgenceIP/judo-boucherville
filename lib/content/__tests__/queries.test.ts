import { describe, it, expect } from 'vitest'
import { evaluate, parse } from 'groq-js'
import { ATHLETE, CLUB, EQUIPES, PROGRAMMES, SAISONS } from '../queries'

const run = async (q: string, dataset: object[], params: Record<string, unknown> = {}) =>
  await (await evaluate(parse(q, { params }), { dataset, params })).get()

const img = { _id: 'image-1', _type: 'sanity.imageAsset', url: 'https://cdn.sanity.io/a.jpg', metadata: { dimensions: { width: 800, height: 600 } } }
const club = {
  _id: 'club', _type: 'club', nom: 'Club',
  inscription: { saison: '2026-2027', colonnesTarif: ['Avant', 'Après'], notes: ['Note'], debutCours: [{ programme: 'Adultes', date: '2 sept.' }] },
  palmares: [{ championnat: 'Provinciaux', or: 1, argent: 2, bronze: 3 }],
}

describe('CLUB', () => {
  it('falls back to French when an English field is empty', async () => {
    const r = await run(CLUB, [club])
    expect(r.inscription.debutCours).toEqual([{ programme: 'Adultes', programmeEn: 'Adultes', date: '2 sept.', dateEn: '2 sept.' }])
    expect(r.inscription.notesEn).toEqual(['Note'])
    expect(r.inscription.colonnesTarifEn).toEqual(['Avant', 'Après'])
    expect(r.palmares[0].championnatEn).toBe('Provinciaux')
  })
})

describe('PROGRAMMES', () => {
  const instr = { _id: 'instructeur-jeremie-blain', _type: 'instructeur', nom: 'Jérémie Blain', grade: '1er dan', slug: { current: 'jeremie-blain' } }
  const base = { _type: 'programme', titre: 'Judo', groupes: [], tarifs: [] }
  const dataset = [club, instr, img,
    { ...base, _id: 'programme-a', slug: { current: 'a' }, orderRank: '0|b', titreEn: 'Judo EN',
      instructeurs: [{ ref: { _ref: 'instructeur-jeremie-blain' }, grade: 'Ceinture noire judo et BJJ' }, { nom: 'Invité', grade: '2e dan' }],
      qr: { asset: { _ref: 'image-1' } }, notes: [] },
    { ...base, _id: 'programme-b', slug: { current: 'b' }, orderRank: '0|a', colonnes: ['Session'] },
    { ...base, _id: 'drafts.programme-c', orderRank: '0|c' }, // never published: no slug yet
  ]
  it('resolves instructors, columns, English fallback, images and empty lists', async () => {
    const [b, a] = await run(PROGRAMMES, dataset)
    expect(b.slug).toBe('b')
    expect(b.colonnes).toEqual(['Session'])
    expect(a.colonnes).toEqual(['Avant', 'Après'])
    expect(a.titreEn).toBe('Judo EN')
    expect(b.titreEn).toBe('Judo')
    expect(a.instructeurs).toEqual([
      { nom: 'Jérémie Blain', grade: 'Ceinture noire judo et BJJ', slug: 'jeremie-blain' },
      { nom: 'Invité', grade: '2e dan', slug: null },
    ])
    expect(a.qr).toBe('https://cdn.sanity.io/a.jpg')
    expect(a.notes).toBeNull()
  })
  it('skips programmes that were never published', async () => {
    expect(await run(PROGRAMMES, dataset)).toHaveLength(2)
  })
})

describe('athletes', () => {
  const dataset = [img,
    { _id: 'athlete-a', _type: 'athlete', nom: 'A', slug: { current: 'a' }, equipes: ['u16'], photos: [{ asset: { _ref: 'image-1' }, hotspot: { x: 0.5, y: 0.2 } }] },
    { _id: 'athlete-b', _type: 'athlete', nom: 'B', slug: { current: 'b' }, equipes: ['u16'] },
  ]
  it('a page exists only with photos or a profile', async () => {
    expect(await run(EQUIPES, dataset)).toEqual([
      { nom: 'A', slug: 'a', equipes: ['u16'], aPage: true },
      { nom: 'B', slug: 'b', equipes: ['u16'], aPage: false },
    ])
    expect(await run(ATHLETE, dataset, { slug: 'b' })).toBeNull()
    const a = await run(ATHLETE, dataset, { slug: 'a' })
    expect(a.photos).toEqual([{ src: 'https://cdn.sanity.io/a.jpg', w: 800, h: 600, hotspot: { x: 0.5, y: 0.2 } }])
  })
})

describe('SAISONS', () => {
  it('lists each season once', async () => {
    const r = await run(SAISONS, [
      { _id: '1', _type: 'resultat', saison: '2025-2026' }, { _id: '2', _type: 'resultat', saison: '2025-2026' },
      { _id: '3', _type: 'actualite', saison: '2024-2025' },
    ], { type: 'resultat' })
    expect(r).toEqual(['2025-2026'])
  })
})
